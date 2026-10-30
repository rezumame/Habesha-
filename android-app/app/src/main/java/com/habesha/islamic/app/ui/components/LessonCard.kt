package com.habesha.islamic.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.habesha.islamic.app.data.model.Lesson
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
fun LessonCard(
    lesson: Lesson,
    onStudyClick: () -> Unit,
    onPlayAudioClick: () -> Unit,
    onToggleBookmark: () -> Unit,
    onToggleCompleted: () -> Unit,
    onEditClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
            .clickable { onStudyClick() }
            .padding(14.dp)
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Header Row: Lesson #, Category, Duration, and Action Icons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = "ትምህርት ${lesson.lessonNumber}",
                        color = GoldPrimary,
                        fontSize = 11.5.sp,
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
                        fontSize = 11.5.sp
                    )

                    lesson.audio?.duration?.let { dur ->
                        if (dur.isNotBlank()) {
                            Text(
                                text = "•",
                                color = TextMuted,
                                fontSize = 10.sp
                            )
                            Text(
                                text = dur,
                                color = TextMuted,
                                fontSize = 11.sp
                            )
                        }
                    }

                    if (lesson.isCompleted) {
                        Text(
                            text = "✓ ተጠናቋል",
                            color = EmeraldAccent,
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                // Action icons: Bookmark, Edit, Delete
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Bookmark icon
                    Icon(
                        imageVector = if (lesson.isBookmarked) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                        contentDescription = "ዕልባት",
                        tint = if (lesson.isBookmarked) GoldPrimary else TextMuted,
                        modifier = Modifier
                            .size(19.dp)
                            .clickable { onToggleBookmark() }
                    )

                    // Edit icon
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "አስተካክል",
                        tint = TextMuted,
                        modifier = Modifier
                            .size(17.dp)
                            .clickable { onEditClick() }
                    )

                    // Delete icon
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "ሰርዝ",
                        tint = Color(0xFFEF4444).copy(alpha = 0.8f),
                        modifier = Modifier
                            .size(17.dp)
                            .clickable { onDeleteClick() }
                    )
                }
            }

            // Title Amharic / Main
            Text(
                text = "ክፍል ${lesson.lessonNumber}: ${lesson.title}",
                color = TextPrimary,
                fontSize = 14.5.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            // Title Arabic
            if (!lesson.titleArabic.isNullOrBlank()) {
                Text(
                    text = lesson.titleArabic,
                    color = GoldLight,
                    fontSize = 12.5.sp,
                    fontFamily = FontFamily.Serif,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Description
            if (lesson.description.isNotBlank()) {
                Text(
                    text = lesson.description,
                    color = TextSecondary,
                    fontSize = 12.sp,
                    lineHeight = 17.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.height(2.dp))

            // Bottom Badges and Study Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Media Badges
                Row(
                    horizontalArrangement = Arrangement.spacedBy(5.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (lesson.audio != null && lesson.audio.url.isNotBlank()) {
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(DarkSurface)
                                .clickable { onPlayAudioClick() }
                                .padding(horizontal = 7.dp, vertical = 3.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(3.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Headphones,
                                contentDescription = "ድምፅ",
                                tint = EmeraldAccent,
                                modifier = Modifier.size(11.dp)
                            )
                            Text(
                                text = "MP3 ድምፅ",
                                color = EmeraldAccent,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }

                    if (lesson.video != null && lesson.video.url.isNotBlank()) {
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(DarkSurface)
                                .padding(horizontal = 7.dp, vertical = 3.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(3.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Videocam,
                                contentDescription = "ቪድዮ",
                                tint = GoldPrimary,
                                modifier = Modifier.size(11.dp)
                            )
                            Text(
                                text = "ቪድዮ",
                                color = GoldPrimary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }

                    if (lesson.pdf != null && lesson.pdf.url.isNotBlank()) {
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(DarkSurface)
                                .padding(horizontal = 7.dp, vertical = 3.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(3.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.PictureAsPdf,
                                contentDescription = "PDF",
                                tint = Color(0xFFF87171),
                                modifier = Modifier.size(11.dp)
                            )
                            Text(
                                text = "PDF ሰነድ",
                                color = Color(0xFFF87171),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                // Study Button: "ትምህርቱን አጥና ▶"
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(GoldPrimary.copy(alpha = 0.16f))
                        .clickable { onStudyClick() }
                        .padding(horizontal = 10.dp, vertical = 5.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(3.dp)
                ) {
                    Text(
                        text = "ትምህርቱን አጥና",
                        color = GoldPrimary,
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = "አጥና",
                        tint = GoldPrimary,
                        modifier = Modifier.size(13.dp)
                    )
                }
            }
        }
    }
}
