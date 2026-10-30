package com.habesha.islamic.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.habesha.islamic.app.data.model.Lesson
import com.habesha.islamic.app.ui.theme.DarkBackground
import com.habesha.islamic.app.ui.theme.DarkBorder
import com.habesha.islamic.app.ui.theme.DarkSurface
import com.habesha.islamic.app.ui.theme.DarkSurfaceElevated
import com.habesha.islamic.app.ui.theme.EmeraldAccent
import com.habesha.islamic.app.ui.theme.GoldDark
import com.habesha.islamic.app.ui.theme.GoldLight
import com.habesha.islamic.app.ui.theme.GoldPrimary
import com.habesha.islamic.app.ui.theme.TextMuted
import com.habesha.islamic.app.ui.theme.TextPrimary
import com.habesha.islamic.app.ui.theme.TextSecondary

@Composable
fun AudioLessonsScreen(
    lessons: List<Lesson>,
    currentPlayingLesson: Lesson?,
    isPlayingAudio: Boolean,
    onPlayAudio: (Lesson) -> Unit,
    onAddLesson: () -> Unit,
    onDeleteLesson: (String) -> Unit
) {
    val context = LocalContext.current
    val audioLessons = lessons.filter { it.audio != null && it.audio.url.isNotBlank() }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 12.dp, end = 12.dp, top = 8.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Top Header
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "የድምፅ ትምህርቶች (MP3 Library)",
                            color = GoldLight,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "በከፍተኛ የጥራት ደረጃ የተቀረፁ የዳዕዋ እና የትምህርት ድምፆች",
                            color = TextSecondary,
                            fontSize = 11.5.sp
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(EmeraldAccent.copy(alpha = 0.15f))
                            .border(1.dp, EmeraldAccent.copy(alpha = 0.3f), RoundedCornerShape(10.dp))
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "${audioLessons.size} MP3 ድምፆች",
                            color = EmeraldAccent,
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        if (audioLessons.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 24.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkSurface)
                        .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .clip(CircleShape)
                                .background(EmeraldAccent.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Headphones,
                                contentDescription = "ድምፅ",
                                tint = EmeraldAccent,
                                modifier = Modifier.size(26.dp)
                            )
                        }

                        Text(
                            text = "ምንም የድምፅ ትምህርት አልተጫነም",
                            color = TextPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )

                        Text(
                            text = "አዲስ ትምህርት ሲጨምሩ የድምፅ ሊንክ (MP3) በማስገባት እዚህ ዝርዝር ውስጥ በቀላሉ ማዳመጥ እና ማውረድ ይችላሉ::",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            lineHeight = 17.sp
                        )

                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(GoldPrimary)
                                .clickable { onAddLesson() }
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "ትምህርት ጫን",
                                tint = DarkSurface,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "አዲስ የድምፅ ትምህርት ጫን",
                                color = DarkSurface,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        } else {
            items(audioLessons, key = { it.id }) { lesson ->
                val isCurrentPlaying = currentPlayingLesson?.id == lesson.id && isPlayingAudio

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isCurrentPlaying) GoldPrimary.copy(alpha = 0.12f) else DarkSurfaceElevated)
                        .border(
                            1.dp,
                            if (isCurrentPlaying) GoldPrimary else DarkBorder,
                            RoundedCornerShape(12.dp)
                        )
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Play / Pause Circle
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(if (isCurrentPlaying) GoldPrimary else DarkSurface)
                                .border(
                                    1.dp,
                                    if (isCurrentPlaying) GoldPrimary else DarkBorder,
                                    CircleShape
                                )
                                .clickable { onPlayAudio(lesson) },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isCurrentPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = if (isCurrentPlaying) "አቁም" else "አጫውት",
                                tint = if (isCurrentPlaying) DarkBackground else GoldPrimary,
                                modifier = Modifier.size(22.dp)
                            )
                        }

                        // Info Column
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Text(
                                    text = "ክፍል ${lesson.lessonNumber}",
                                    color = GoldPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "•",
                                    color = TextMuted,
                                    fontSize = 10.sp
                                )
                                Text(
                                    text = lesson.category,
                                    color = TextSecondary,
                                    fontSize = 11.sp
                                )
                                lesson.audio?.duration?.let {
                                    Text(
                                        text = "• $it",
                                        color = TextMuted,
                                        fontSize = 10.5.sp
                                    )
                                }
                            }

                            Text(
                                text = lesson.title,
                                color = TextPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )

                            if (!lesson.titleArabic.isNullOrBlank()) {
                                Text(
                                    text = lesson.titleArabic,
                                    color = GoldLight,
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Serif
                                )
                            }
                        }

                        // Right actions: Download & Delete
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            // Download button
                            Icon(
                                imageVector = Icons.Default.CloudDownload,
                                contentDescription = "አውርድ",
                                tint = EmeraldAccent,
                                modifier = Modifier
                                    .size(20.dp)
                                    .clickable {
                                        try {
                                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(lesson.audio?.url))
                                            context.startActivity(intent)
                                        } catch (e: Exception) {
                                            Toast.makeText(context, "ፋይሉን መክፈት አልተቻለም", Toast.LENGTH_SHORT).show()
                                        }
                                    }
                            )

                            // Delete button
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "ሰርዝ",
                                tint = Color(0xFFEF4444).copy(alpha = 0.8f),
                                modifier = Modifier
                                    .size(20.dp)
                                    .clickable { onDeleteLesson(lesson.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}
