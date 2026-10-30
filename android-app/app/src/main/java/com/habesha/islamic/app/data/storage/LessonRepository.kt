package com.habesha.islamic.app.data.storage

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.habesha.islamic.app.data.model.Lesson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

class LessonRepository(private val context: Context) {
    private val gson = Gson()
    private val file = File(context.filesDir, "habesha_lessons.json")

    suspend fun getLessons(): List<Lesson> = withContext(Dispatchers.IO) {
        if (!file.exists()) {
            return@withContext emptyList()
        }
        try {
            val json = file.readText()
            val type = object : TypeToken<List<Lesson>>() {}.type
            val list: List<Lesson>? = gson.fromJson(json, type)
            list?.sortedBy { it.lessonNumber } ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun saveLesson(lesson: Lesson) = withContext(Dispatchers.IO) {
        val current = getLessons().toMutableList()
        val index = current.indexOfFirst { it.id == lesson.id }
        if (index >= 0) {
            current[index] = lesson
        } else {
            current.add(lesson)
        }
        current.sortBy { it.lessonNumber }
        writeLessons(current)
    }

    suspend fun deleteLesson(id: String) = withContext(Dispatchers.IO) {
        val current = getLessons().toMutableList()
        current.removeAll { it.id == id }
        writeLessons(current)
    }

    suspend fun toggleBookmark(id: String): Boolean = withContext(Dispatchers.IO) {
        val current = getLessons().toMutableList()
        val index = current.indexOfFirst { it.id == id }
        if (index >= 0) {
            val updated = current[index].copy(isBookmarked = !current[index].isBookmarked)
            current[index] = updated
            writeLessons(current)
            return@withContext updated.isBookmarked
        }
        false
    }

    suspend fun toggleCompleted(id: String): Boolean = withContext(Dispatchers.IO) {
        val current = getLessons().toMutableList()
        val index = current.indexOfFirst { it.id == id }
        if (index >= 0) {
            val updated = current[index].copy(isCompleted = !current[index].isCompleted)
            current[index] = updated
            writeLessons(current)
            return@withContext updated.isCompleted
        }
        false
    }

    suspend fun clearAll() = withContext(Dispatchers.IO) {
        writeLessons(emptyList())
    }

    suspend fun exportJson(): String = withContext(Dispatchers.IO) {
        if (file.exists()) file.readText() else "[]"
    }

    suspend fun importJson(json: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val type = object : TypeToken<List<Lesson>>() {}.type
            val imported: List<Lesson>? = gson.fromJson(json, type)
            if (imported != null) {
                writeLessons(imported.sortedBy { it.lessonNumber })
                return@withContext true
            }
        } catch (_: Exception) {}
        false
    }

    private fun writeLessons(lessons: List<Lesson>) {
        val json = gson.toJson(lessons)
        file.writeText(json)
    }
}
