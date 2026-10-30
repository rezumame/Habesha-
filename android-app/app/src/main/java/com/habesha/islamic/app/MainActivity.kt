package com.habesha.islamic.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.habesha.islamic.app.data.model.MainNavTab
import com.habesha.islamic.app.ui.components.BottomNavBar
import com.habesha.islamic.app.ui.components.FloatingAudioBar
import com.habesha.islamic.app.ui.components.TopNavBar
import com.habesha.islamic.app.ui.screens.AddEditLessonDialog
import com.habesha.islamic.app.ui.screens.AudioLessonsScreen
import com.habesha.islamic.app.ui.screens.DocumentCenterScreen
import com.habesha.islamic.app.ui.screens.LessonDetailDialog
import com.habesha.islamic.app.ui.screens.LessonsScreen
import com.habesha.islamic.app.ui.screens.OfflineStorageScreen
import com.habesha.islamic.app.ui.screens.SystemStructureScreen
import com.habesha.islamic.app.ui.theme.DarkBackground
import com.habesha.islamic.app.ui.theme.HabeshaTheme
import com.habesha.islamic.app.ui.viewmodel.HabeshaViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            HabeshaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DarkBackground
                ) {
                    HabeshaApp()
                }
            }
        }
    }
}

@Composable
fun HabeshaApp(viewModel: HabeshaViewModel = viewModel()) {
    val currentTab by viewModel.currentTab.collectAsState()
    val allLessons by viewModel.lessons.collectAsState()
    val filteredLessons by viewModel.filteredLessons.collectAsState()

    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedRange by viewModel.selectedRange.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val sortBy by viewModel.sortBy.collectAsState()

    val activeDetailLesson by viewModel.activeDetailLesson.collectAsState()
    val showAddEditDialog by viewModel.showAddEditDialog.collectAsState()
    val editingLesson by viewModel.editingLesson.collectAsState()

    val currentPlayingLesson by viewModel.currentPlayingLesson.collectAsState()
    val isPlayingAudio by viewModel.isPlayingAudio.collectAsState()
    val audioProgress by viewModel.audioProgress.collectAsState()
    val audioCurrentTime by viewModel.audioCurrentTime.collectAsState()
    val audioTotalTime by viewModel.audioTotalTime.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding()
            .background(DarkBackground)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Top Navigation Bar
            TopNavBar(
                selectedTab = currentTab,
                onTabSelected = { viewModel.setTab(it) },
                onAddClick = { viewModel.openAddLesson() }
            )

            // Main Content Area
            Box(modifier = Modifier.weight(1f)) {
                when (currentTab) {
                    MainNavTab.LESSONS -> {
                        LessonsScreen(
                            lessons = filteredLessons,
                            totalCount = allLessons.size,
                            searchQuery = searchQuery,
                            onSearchChange = { viewModel.searchQuery.value = it },
                            selectedRange = selectedRange,
                            onRangeSelected = { viewModel.selectedRange.value = it },
                            selectedCategory = selectedCategory,
                            onCategorySelected = { viewModel.selectedCategory.value = it },
                            sortBy = sortBy,
                            onToggleSort = {
                                viewModel.sortBy.value = if (sortBy == "በቅደም ተከተል") "በአዲስ" else "በቅደም ተከተል"
                            },
                            onRefresh = { viewModel.loadLessons() },
                            onAddClick = { viewModel.openAddLesson() },
                            onStudyClick = { viewModel.openDetail(it) },
                            onPlayAudioClick = { viewModel.playAudio(it) },
                            onToggleBookmark = { viewModel.toggleBookmark(it) },
                            onToggleCompleted = { viewModel.toggleCompleted(it) },
                            onEditClick = { viewModel.openEditLesson(it) },
                            onDeleteClick = { viewModel.deleteLesson(it) }
                        )
                    }

                    MainNavTab.DOCUMENTS -> {
                        DocumentCenterScreen(
                            lessons = allLessons,
                            onOpenLessonDetail = { viewModel.openDetail(it) },
                            onAddLesson = { viewModel.openAddLesson() },
                            onDeleteLesson = { viewModel.deleteLesson(it) }
                        )
                    }

                    MainNavTab.AUDIO -> {
                        AudioLessonsScreen(
                            lessons = allLessons,
                            currentPlayingLesson = currentPlayingLesson,
                            isPlayingAudio = isPlayingAudio,
                            onPlayAudio = { viewModel.playAudio(it) },
                            onAddLesson = { viewModel.openAddLesson() },
                            onDeleteLesson = { viewModel.deleteLesson(it) }
                        )
                    }

                    MainNavTab.OFFLINE -> {
                        OfflineStorageScreen(
                            lessons = allLessons,
                            onClearAll = { viewModel.clearAllData() },
                            onExportJson = { viewModel.exportJson() },
                            onImportJson = { viewModel.importJson(it) }
                        )
                    }

                    MainNavTab.STRUCTURE -> {
                        SystemStructureScreen()
                    }
                }
            }

            // Floating Mini Audio Player (if playing or selected)
            if (currentPlayingLesson != null) {
                FloatingAudioBar(
                    lesson = currentPlayingLesson!!,
                    isPlaying = isPlayingAudio,
                    progress = audioProgress,
                    currentTime = audioCurrentTime,
                    totalTime = audioTotalTime,
                    onPlayPause = {
                        if (isPlayingAudio) viewModel.pauseAudio() else viewModel.resumeAudio()
                    },
                    onStop = { viewModel.stopAudio() },
                    onOpenDetail = { viewModel.openDetail(currentPlayingLesson!!) }
                )
            }

            // Bottom Navigation Bar
            BottomNavBar(
                selectedTab = currentTab,
                onTabSelected = { viewModel.setTab(it) }
            )
        }

        // Active Lesson Detail Modal
        if (activeDetailLesson != null) {
            LessonDetailDialog(
                lesson = activeDetailLesson!!,
                isPlayingAudio = isPlayingAudio && currentPlayingLesson?.id == activeDetailLesson?.id,
                audioProgress = if (currentPlayingLesson?.id == activeDetailLesson?.id) audioProgress else 0f,
                audioCurrentTime = if (currentPlayingLesson?.id == activeDetailLesson?.id) audioCurrentTime else "00:00",
                audioTotalTime = if (currentPlayingLesson?.id == activeDetailLesson?.id) audioTotalTime else "00:00",
                onPlayPauseAudio = {
                    viewModel.playAudio(activeDetailLesson!!)
                },
                onSeekAudio = { fraction ->
                    if (currentPlayingLesson?.id == activeDetailLesson?.id) {
                        viewModel.seekToFraction(fraction)
                    } else {
                        viewModel.playAudio(activeDetailLesson!!)
                    }
                },
                onToggleBookmark = { viewModel.toggleBookmark(activeDetailLesson!!.id) },
                onToggleCompleted = { viewModel.toggleCompleted(activeDetailLesson!!.id) },
                onClose = { viewModel.closeDetail() }
            )
        }

        // Add / Edit Lesson Dialog
        if (showAddEditDialog) {
            AddEditLessonDialog(
                initialLesson = editingLesson,
                onSave = { viewModel.saveLesson(it) },
                onDismiss = { viewModel.closeAddEditDialog() }
            )
        }
    }
}
