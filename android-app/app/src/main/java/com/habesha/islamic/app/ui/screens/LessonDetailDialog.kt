package com.habesha.islamic.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.Toast
import androidx.annotation.OptIn
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.media3.common.MediaItem
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import com.habesha.islamic.app.data.model.Lesson
import com.habesha.islamic.app.ui.theme.DarkBackground
import com.habesha.islamic.app.ui.theme.DarkBorder
import com.habesha.islamic.app.ui.theme.DarkSurface
import com.habesha.islamic.app.ui.theme.DarkSurfaceElevated
import com.habesha.islamic.app.ui.theme.EmeraldAccent
import com.habesha.islamic.app.ui.theme.GoldDark
import com.habesha.islamic.app.ui.theme.GoldLight
import com.habesha.islamic.app.ui.theme.GoldPrimary
import com.habesha.islamic.app.ui.theme.TelegramCyan
import com.habesha.islamic.app.ui.theme.TextMuted
import com.habesha.islamic.app.ui.theme.TextPrimary
import com.habesha.islamic.app.ui.theme.TextSecondary

@OptIn(UnstableApi::class)
@Composable
fun LessonDetailDialog(
    lesson: Lesson,
    isPlayingAudio: Boolean,
    audioProgress: Float,
    audioCurrentTime: String,
    audioTotalTime: String,
    onPlayPauseAudio: () -> Unit,
    onSeekAudio: (Float) -> Unit,
    onToggleBookmark: () -> Unit,
    onToggleCompleted: () -> Unit,
    onClose: () -> Unit
) {
    val context = LocalContext.current
    var selectedMediaTab by remember { mutableIntStateOf(0) } // 0: Video, 1: Audio, 2: PDF, 3: Notes
    val scrollState = rememberScrollState()

    // Video ExoPlayer instance for this dialog
    val videoPlayer = remember(lesson.video?.url) {
        if (!lesson.video?.url.isNullOrBlank()) {
            ExoPlayer.Builder(context).build().apply {
                try {
                    val mediaItem = MediaItem.fromUri(lesson.video!!.url)
                    setMediaItem(mediaItem)
                    prepare()
                } catch (_: Exception) {}
            }
        } else {
            null
        }
    }

    DisposableEffect(videoPlayer) {
        onDispose {
            videoPlayer?.release()
        }
    }

    Dialog(
        onDismissRequest = onClose,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(DarkBackground)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Header Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DarkSurfaceElevated)
                        .border(width = 0.5.dp, color = DarkBorder)
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onClose) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "ዝጋ",
                            tint = TextPrimary
                        )
                    }

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(
                            text = "ክፍል ${lesson.lessonNumber}: ${lesson.title}",
                            color = GoldLight,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.5.sp,
                            maxLines = 1
                        )
                        if (!lesson.titleArabic.isNullOrBlank()) {
                            Text(
                                text = lesson.titleArabic,
                                color = GoldPrimary,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Serif,
                                maxLines = 1
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Bookmark
                        IconButton(onClick = onToggleBookmark) {
                            Icon(
                                imageVector = if (lesson.isBookmarked) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                                contentDescription = "ዕልባት",
                                tint = if (lesson.isBookmarked) GoldPrimary else TextMuted
                            )
                        }

                        // Completed toggle
                        IconButton(onClick = onToggleCompleted) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "ተጠናቋል",
                                tint = if (lesson.isCompleted) EmeraldAccent else TextMuted
                            )
                        }

                        // Telegram share
                        IconButton(onClick = {
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(
                                    Intent.EXTRA_TEXT,
                                    "ትምህርት ${lesson.lessonNumber}: ${lesson.title}\n${lesson.description}\nበሐበሻ ኢስላማዊ አካዳሚ"
                                )
                            }
                            context.startActivity(Intent.createChooser(shareIntent, "ትምህርቱን አጋራ"))
                        }) {
                            Icon(
                                imageVector = Icons.Default.Share,
                                contentDescription = "አጋራ",
                                tint = TelegramCyan
                            )
                        }
                    }
                }

                // Media Tabs Row: Video, Audio, PDF, Notes
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DarkSurface)
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    val tabs = listOf(
                        "ቪድዮ" to Icons.Default.Videocam,
                        "ድምፅ (MP3)" to Icons.Default.Headphones,
                        "ሰነድ (PDF)" to Icons.Default.PictureAsPdf,
                        "ማብራሪያ" to Icons.Default.Description
                    )

                    tabs.forEachIndexed { index, (label, icon) ->
                        val isSelected = selectedMediaTab == index
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (isSelected) GoldPrimary else DarkSurfaceElevated
                                )
                                .clickable { selectedMediaTab = index }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = label,
                                    tint = if (isSelected) DarkBackground else TextSecondary,
                                    modifier = Modifier.size(14.dp)
                                )
                                Text(
                                    text = label,
                                    color = if (isSelected) DarkBackground else TextSecondary,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                )
                            }
                        }
                    }
                }

                // Media Content Area
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(scrollState)
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    when (selectedMediaTab) {
                        // 0: Video Player Screen
                        0 -> {
                            if (lesson.video != null && lesson.video.url.isNotBlank()) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(220.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color.Black)
                                        .border(1.dp, GoldPrimary.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                                ) {
                                    if (videoPlayer != null) {
                                        AndroidView(
                                            factory = { ctx ->
                                                PlayerView(ctx).apply {
                                                    player = videoPlayer
                                                    useController = true
                                                    layoutParams = FrameLayout.LayoutParams(
                                                        ViewGroup.LayoutParams.MATCH_PARENT,
                                                        ViewGroup.LayoutParams.MATCH_PARENT
                                                    )
                                                }
                                            },
                                            modifier = Modifier.fillMaxSize()
                                        )
                                    }
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "የቪድዮ ትምህርት የቀጥታ ስርጭት (Streaming)",
                                        color = GoldLight,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Row(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(EmeraldAccent.copy(alpha = 0.15f))
                                            .clickable {
                                                try {
                                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(lesson.video.url))
                                                    context.startActivity(intent)
                                                } catch (_: Exception) {}
                                            }
                                            .padding(horizontal = 8.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(3.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.CloudDownload,
                                            contentDescription = "ቪድዮ አውርድ",
                                            tint = EmeraldAccent,
                                            modifier = Modifier.size(12.dp)
                                        )
                                        Text(
                                            text = "አውርድ",
                                            color = EmeraldAccent,
                                            fontSize = 11.sp
                                        )
                                    }
                                }
                            } else {
                                EmptyMediaCard(
                                    title = "ለዚህ ትምህርት ቪድዮ አልተካተተም",
                                    subtitle = "ትምህርቱን በማስተካከል የቪድዮ ሊንክ ማከል ይችላሉ::",
                                    icon = Icons.Default.Videocam
                                )
                            }
                        }

                        // 1: Audio Player Screen
                        1 -> {
                            if (lesson.audio != null && lesson.audio.url.isNotBlank()) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(DarkSurfaceElevated)
                                        .border(1.dp, GoldPrimary.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                                        .padding(16.dp)
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(70.dp)
                                                .clip(CircleShape)
                                                .background(GoldPrimary.copy(alpha = 0.15f))
                                                .border(2.dp, GoldPrimary, CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Headphones,
                                                contentDescription = "ድምፅ",
                                                tint = GoldPrimary,
                                                modifier = Modifier.size(36.dp)
                                            )
                                        }

                                        Text(
                                            text = lesson.title,
                                            color = TextPrimary,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 15.sp
                                        )

                                        // Progress Slider
                                        Column(modifier = Modifier.fillMaxWidth()) {
                                            Slider(
                                                value = audioProgress,
                                                onValueChange = { onSeekAudio(it) },
                                                colors = SliderDefaults.colors(
                                                    thumbColor = GoldPrimary,
                                                    activeTrackColor = GoldPrimary,
                                                    inactiveTrackColor = DarkBorder
                                                ),
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.SpaceBetween
                                            ) {
                                                Text(
                                                    text = audioCurrentTime,
                                                    color = TextMuted,
                                                    fontSize = 11.sp
                                                )
                                                Text(
                                                    text = audioTotalTime,
                                                    color = TextMuted,
                                                    fontSize = 11.sp
                                                )
                                            }
                                        }

                                        // Controls Row: Play/Pause and Download
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceEvenly,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            // Download MP3
                                            Row(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(20.dp))
                                                    .background(EmeraldAccent.copy(alpha = 0.15f))
                                                    .clickable {
                                                        try {
                                                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(lesson.audio.url))
                                                            context.startActivity(intent)
                                                        } catch (_: Exception) {}
                                                    }
                                                    .padding(horizontal = 12.dp, vertical = 8.dp),
                                                verticalAlignment = Alignment.CenterVertically,
                                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.CloudDownload,
                                                    contentDescription = "አውርድ",
                                                    tint = EmeraldAccent,
                                                    modifier = Modifier.size(16.dp)
                                                )
                                                Text(
                                                    text = "MP3 አውርድ",
                                                    color = EmeraldAccent,
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }

                                            // Play / Pause Circle Button
                                            Box(
                                                modifier = Modifier
                                                    .size(54.dp)
                                                    .clip(CircleShape)
                                                    .background(GoldPrimary)
                                                    .clickable { onPlayPauseAudio() },
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Icon(
                                                    imageVector = if (isPlayingAudio) Icons.Default.Pause else Icons.Default.PlayArrow,
                                                    contentDescription = "አጫውት",
                                                    tint = DarkBackground,
                                                    modifier = Modifier.size(30.dp)
                                                )
                                            }
                                        }
                                    }
                                }
                            } else {
                                EmptyMediaCard(
                                    title = "ለዚህ ትምህርት የድምፅ ፋይል አልተካተተም",
                                    subtitle = "ትምህርቱን በማስተካከል የድምፅ ሊንክ (MP3) ማከል ይችላሉ::",
                                    icon = Icons.Default.Headphones
                                )
                            }
                        }

                        // 2: PDF Document Viewer Screen
                        2 -> {
                            if (lesson.pdf != null && lesson.pdf.url.isNotBlank()) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(DarkSurfaceElevated)
                                        .border(1.dp, Color(0xFFEF4444).copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                                        .padding(16.dp)
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(60.dp)
                                                .clip(CircleShape)
                                                .background(Color(0xFFEF4444).copy(alpha = 0.15f)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.PictureAsPdf,
                                                contentDescription = "PDF",
                                                tint = Color(0xFFF87171),
                                                modifier = Modifier.size(32.dp)
                                            )
                                        }

                                        Text(
                                            text = lesson.pdf.fileName ?: "የጥናት መጽሐፍ (PDF ሰነድ)",
                                            color = TextPrimary,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp
                                        )

                                        Text(
                                            text = "ይህንን ሰነድ በስልክዎ ላይ በቀጥታ ለማንበብ ወይም ለማውረድ ከታች ያሉትን አማራጮች ይጠቀሙ::",
                                            color = TextSecondary,
                                            fontSize = 12.sp,
                                            lineHeight = 17.sp
                                        )

                                        Row(
                                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                                        ) {
                                            // Read Online / Open
                                            Row(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(20.dp))
                                                    .background(GoldPrimary)
                                                    .clickable {
                                                        try {
                                                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(lesson.pdf.url))
                                                            context.startActivity(intent)
                                                        } catch (_: Exception) {
                                                            Toast.makeText(context, "ሰነዱን መክፈት አልተቻለም", Toast.LENGTH_SHORT).show()
                                                        }
                                                    }
                                                    .padding(horizontal = 14.dp, vertical = 9.dp),
                                                verticalAlignment = Alignment.CenterVertically,
                                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Visibility,
                                                    contentDescription = "አንብብ",
                                                    tint = DarkBackground,
                                                    modifier = Modifier.size(15.dp)
                                                )
                                                Text(
                                                    text = "ሰነዱን ክፈት / አንብብ",
                                                    color = DarkBackground,
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 12.sp
                                                )
                                            }

                                            // Download PDF
                                            Row(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(20.dp))
                                                    .background(EmeraldAccent.copy(alpha = 0.15f))
                                                    .clickable {
                                                        try {
                                                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(lesson.pdf.url))
                                                            context.startActivity(intent)
                                                        } catch (_: Exception) {}
                                                    }
                                                    .padding(horizontal = 14.dp, vertical = 9.dp),
                                                verticalAlignment = Alignment.CenterVertically,
                                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.CloudDownload,
                                                    contentDescription = "አውርድ",
                                                    tint = EmeraldAccent,
                                                    modifier = Modifier.size(15.dp)
                                                )
                                                Text(
                                                    text = "PDF አውርድ",
                                                    color = EmeraldAccent,
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 12.sp
                                                )
                                            }
                                        }
                                    }
                                }
                            } else {
                                EmptyMediaCard(
                                    title = "ለዚህ ትምህርት የPDF ሰነድ አልተካተተም",
                                    subtitle = "ትምህርቱን በማስተካከል የPDF ሰነድ ሊንክ ማከል ይችላሉ::",
                                    icon = Icons.Default.PictureAsPdf
                                )
                            }
                        }

                        // 3: Notes & Info Screen
                        3 -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(DarkSurfaceElevated)
                                    .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
                                    .padding(14.dp)
                            ) {
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Text(
                                        text = "የትምህርቱ ማብራሪያ እና ዝርዝር መረጃ",
                                        color = GoldLight,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp
                                    )
                                    Text(
                                        text = if (lesson.description.isNotBlank()) lesson.description else "ምንም ማብራሪያ አልተፃፈም::",
                                        color = TextSecondary,
                                        fontSize = 13.sp,
                                        lineHeight = 19.sp
                                    )

                                    if (lesson.teacher.isNotBlank()) {
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = "አስተማሪ፡ ${lesson.teacher}",
                                            color = GoldPrimary,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun EmptyMediaCard(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = TextMuted,
                modifier = Modifier.size(34.dp)
            )
            Text(
                text = title,
                color = TextPrimary,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
            Text(
                text = subtitle,
                color = TextMuted,
                fontSize = 11.5.sp
            )
        }
    }
}
