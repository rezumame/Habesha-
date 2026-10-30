package com.habesha.islamic.app.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import com.habesha.islamic.app.data.model.Lesson
import com.habesha.islamic.app.data.model.MainNavTab
import com.habesha.islamic.app.data.storage.LessonRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class HabeshaViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = LessonRepository(application)

    // Main Navigation Tab
    private val _currentTab = MutableStateFlow(MainNavTab.LESSONS)
    val currentTab: StateFlow<MainNavTab> = _currentTab

    // Lessons list
    private val _lessons = MutableStateFlow<List<Lesson>>(emptyList())
    val lessons: StateFlow<List<Lesson>> = _lessons

    // Filter states
    val searchQuery = MutableStateFlow("")
    val selectedRange = MutableStateFlow("ሁሉ") // "ሁሉ", "1-10", "11-20", "ዕልባት", "የተጠናቀቁ"
    val selectedCategory = MutableStateFlow("ሁሉም ዘርፎች")
    val sortBy = MutableStateFlow("በቅደም ተከተል") // "በቅደም ተከተል", "በአዲስ"

    // Dialog & Detail states
    private val _activeDetailLesson = MutableStateFlow<Lesson?>(null)
    val activeDetailLesson: StateFlow<Lesson?> = _activeDetailLesson

    private val _showAddEditDialog = MutableStateFlow(false)
    val showAddEditDialog: StateFlow<Boolean> = _showAddEditDialog

    private val _editingLesson = MutableStateFlow<Lesson?>(null)
    val editingLesson: StateFlow<Lesson?> = _editingLesson

    // Player state
    val exoPlayer: ExoPlayer = ExoPlayer.Builder(application).build()
    private val _currentPlayingLesson = MutableStateFlow<Lesson?>(null)
    val currentPlayingLesson: StateFlow<Lesson?> = _currentPlayingLesson

    private val _isPlayingAudio = MutableStateFlow(false)
    val isPlayingAudio: StateFlow<Boolean> = _isPlayingAudio

    private val _audioProgress = MutableStateFlow(0f)
    val audioProgress: StateFlow<Float> = _audioProgress

    private val _audioCurrentTime = MutableStateFlow("00:00")
    val audioCurrentTime: StateFlow<String> = _audioCurrentTime

    private val _audioTotalTime = MutableStateFlow("00:00")
    val audioTotalTime: StateFlow<String> = _audioTotalTime

    private var progressJob: Job? = null

    // Filtered lessons
    val filteredLessons = combine(
        _lessons,
        searchQuery,
        selectedRange,
        selectedCategory,
        sortBy
    ) { allLessons, query, range, category, sort ->
        var list = allLessons

        // Search
        if (query.isNotBlank()) {
            val q = query.trim().lowercase()
            list = list.filter {
                it.title.lowercase().contains(q) ||
                (it.titleArabic?.contains(q) == true) ||
                (it.titleAmharic?.lowercase()?.contains(q) == true) ||
                it.description.lowercase().contains(q) ||
                it.category.lowercase().contains(q) ||
                "ክፍል ${it.lessonNumber}".contains(q)
            }
        }

        // Category filter
        if (category != "ሁሉም ዘርፎች") {
            list = list.filter { it.category == category }
        }

        // Range filter
        when (range) {
            "1-10" -> list = list.filter { it.lessonNumber in 1..10 }
            "11-20" -> list = list.filter { it.lessonNumber in 11..20 }
            "ዕልባት" -> list = list.filter { it.isBookmarked }
            "የተጠናቀቁ" -> list = list.filter { it.isCompleted }
        }

        // Sort
        list = if (sort == "በአዲስ") {
            list.sortedByDescending { it.lessonNumber }
        } else {
            list.sortedBy { it.lessonNumber }
        }

        list
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        loadLessons()

        exoPlayer.addListener(object : Player.Listener {
            override fun onIsPlayingChanged(isPlaying: Boolean) {
                _isPlayingAudio.value = isPlaying
                if (isPlaying) {
                    startProgressTracker()
                } else {
                    stopProgressTracker()
                }
            }

            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_ENDED) {
                    _isPlayingAudio.value = false
                    stopProgressTracker()
                }
            }

            override fun onPlayerError(error: PlaybackException) {
                _isPlayingAudio.value = false
                stopProgressTracker()
            }
        })
    }

    fun setTab(tab: MainNavTab) {
        _currentTab.value = tab
    }

    fun loadLessons() {
        viewModelScope.launch {
            _lessons.value = repository.getLessons()
        }
    }

    fun saveLesson(lesson: Lesson) {
        viewModelScope.launch {
            repository.saveLesson(lesson)
            loadLessons()
            _showAddEditDialog.value = false
            _editingLesson.value = null
            if (_activeDetailLesson.value?.id == lesson.id) {
                _activeDetailLesson.value = lesson
            }
        }
    }

    fun deleteLesson(id: String) {
        viewModelScope.launch {
            repository.deleteLesson(id)
            if (_currentPlayingLesson.value?.id == id) {
                stopAudio()
            }
            if (_activeDetailLesson.value?.id == id) {
                _activeDetailLesson.value = null
            }
            loadLessons()
        }
    }

    fun toggleBookmark(id: String) {
        viewModelScope.launch {
            repository.toggleBookmark(id)
            loadLessons()
            if (_activeDetailLesson.value?.id == id) {
                _activeDetailLesson.value = _activeDetailLesson.value?.copy(
                    isBookmarked = !(_activeDetailLesson.value?.isBookmarked ?: false)
                )
            }
        }
    }

    fun toggleCompleted(id: String) {
        viewModelScope.launch {
            repository.toggleCompleted(id)
            loadLessons()
            if (_activeDetailLesson.value?.id == id) {
                _activeDetailLesson.value = _activeDetailLesson.value?.copy(
                    isCompleted = !(_activeDetailLesson.value?.isCompleted ?: false)
                )
            }
        }
    }

    fun openAddLesson() {
        _editingLesson.value = null
        _showAddEditDialog.value = true
    }

    fun openEditLesson(lesson: Lesson) {
        _editingLesson.value = lesson
        _showAddEditDialog.value = true
    }

    fun closeAddEditDialog() {
        _showAddEditDialog.value = false
        _editingLesson.value = null
    }

    fun openDetail(lesson: Lesson) {
        _activeDetailLesson.value = lesson
    }

    fun closeDetail() {
        _activeDetailLesson.value = null
    }

    // Audio Playback
    fun playAudio(lesson: Lesson) {
        val audioUrl = lesson.audio?.url
        if (audioUrl.isNullOrBlank()) return

        if (_currentPlayingLesson.value?.id == lesson.id) {
            if (exoPlayer.isPlaying) {
                exoPlayer.pause()
            } else {
                exoPlayer.play()
            }
            return
        }

        _currentPlayingLesson.value = lesson
        try {
            val mediaItem = MediaItem.fromUri(audioUrl)
            exoPlayer.setMediaItem(mediaItem)
            exoPlayer.prepare()
            exoPlayer.play()
        } catch (_: Exception) {
            _isPlayingAudio.value = false
        }
    }

    fun pauseAudio() {
        exoPlayer.pause()
    }

    fun resumeAudio() {
        exoPlayer.play()
    }

    fun seekToFraction(fraction: Float) {
        val duration = exoPlayer.duration
        if (duration > 0) {
            exoPlayer.seekTo((duration * fraction).toLong())
        }
    }

    fun stopAudio() {
        exoPlayer.stop()
        _isPlayingAudio.value = false
        _currentPlayingLesson.value = null
        stopProgressTracker()
    }

    private fun startProgressTracker() {
        stopProgressTracker()
        progressJob = viewModelScope.launch {
            while (true) {
                val current = exoPlayer.currentPosition
                val total = exoPlayer.duration
                if (total > 0) {
                    _audioProgress.value = (current.toFloat() / total.toFloat()).coerceIn(0f, 1f)
                    _audioCurrentTime.value = formatMs(current)
                    _audioTotalTime.value = formatMs(total)
                }
                delay(500)
            }
        }
    }

    private fun stopProgressTracker() {
        progressJob?.cancel()
        progressJob = null
    }

    private fun formatMs(ms: Long): String {
        val totalSecs = (ms / 1000).coerceAtLeast(0)
        val mins = totalSecs / 60
        val secs = totalSecs % 60
        return String.format("%02d:%02d", mins, secs)
    }

    suspend fun clearAllData() {
        stopAudio()
        repository.clearAll()
        loadLessons()
    }

    suspend fun exportJson(): String = repository.exportJson()

    suspend fun importJson(json: String): Boolean {
        val success = repository.importJson(json)
        if (success) loadLessons()
        return success
    }

    override fun onCleared() {
        super.onCleared()
        stopProgressTracker()
        exoPlayer.release()
    }
}
