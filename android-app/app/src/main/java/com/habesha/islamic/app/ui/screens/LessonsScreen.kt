package com.habesha.islamic.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.habesha.islamic.app.data.model.Lesson
import com.habesha.islamic.app.ui.components.EmptyState
import com.habesha.islamic.app.ui.components.HeroBanner
import com.habesha.islamic.app.ui.components.LessonCard
import com.habesha.islamic.app.ui.components.SectionTabs

@Composable
fun LessonsScreen(
    lessons: List<Lesson>,
    totalCount: Int,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    selectedRange: String,
    onRangeSelected: (String) -> Unit,
    selectedCategory: String,
    onCategorySelected: (String) -> Unit,
    sortBy: String,
    onToggleSort: () -> Unit,
    onRefresh: () -> Unit,
    onAddClick: () -> Unit,
    onStudyClick: (Lesson) -> Unit,
    onPlayAudioClick: (Lesson) -> Unit,
    onToggleBookmark: (String) -> Unit,
    onToggleCompleted: (String) -> Unit,
    onEditClick: (Lesson) -> Unit,
    onDeleteClick: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Hero Banner
        item {
            HeroBanner(
                lessonCount = totalCount,
                onRefresh = onRefresh,
                onAddClick = onAddClick
            )
        }

        // Section Tabs, Search, and Filters
        item {
            SectionTabs(
                searchQuery = searchQuery,
                onSearchChange = onSearchChange,
                totalCount = totalCount,
                selectedRange = selectedRange,
                onRangeSelected = onRangeSelected,
                selectedCategory = selectedCategory,
                onCategorySelected = onCategorySelected,
                sortBy = sortBy,
                onToggleSort = onToggleSort
            )
        }

        // Lessons List or Empty State
        if (lessons.isEmpty()) {
            item {
                EmptyState(onAddClick = onAddClick)
            }
        } else {
            items(lessons, key = { it.id }) { lesson ->
                Box(modifier = Modifier.fillMaxSize()) {
                    LessonCard(
                        lesson = lesson,
                        onStudyClick = { onStudyClick(lesson) },
                        onPlayAudioClick = { onPlayAudioClick(lesson) },
                        onToggleBookmark = { onToggleBookmark(lesson.id) },
                        onToggleCompleted = { onToggleCompleted(lesson.id) },
                        onEditClick = { onEditClick(lesson) },
                        onDeleteClick = { onDeleteClick(lesson.id) }
                    )
                }
            }
        }
    }
}
