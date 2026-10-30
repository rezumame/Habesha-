package com.habesha.islamic.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.habesha.islamic.app.data.model.Lesson
import com.habesha.islamic.app.data.model.MediaSource
import com.habesha.islamic.app.ui.theme.DarkBackground
import com.habesha.islamic.app.ui.theme.DarkBorder
import com.habesha.islamic.app.ui.theme.DarkSurface
import com.habesha.islamic.app.ui.theme.DarkSurfaceElevated
import com.habesha.islamic.app.ui.theme.GoldDark
import com.habesha.islamic.app.ui.theme.GoldLight
import com.habesha.islamic.app.ui.theme.GoldPrimary
import com.habesha.islamic.app.ui.theme.TextMuted
import com.habesha.islamic.app.ui.theme.TextPrimary
import com.habesha.islamic.app.ui.theme.TextSecondary
import java.util.UUID

@Composable
fun AddEditLessonDialog(
    initialLesson: Lesson?,
    onSave: (Lesson) -> Unit,
    onDismiss: () -> Unit
) {
    var lessonNumber by remember { mutableIntStateOf(initialLesson?.lessonNumber ?: 1) }
    var title by remember { mutableStateOf(initialLesson?.title ?: "") }
    var titleArabic by remember { mutableStateOf(initialLesson?.titleArabic ?: "") }
    var category by remember { mutableStateOf(initialLesson?.category ?: "ፊቅህ") }
    var teacher by remember { mutableStateOf(initialLesson?.teacher ?: "") }
    var description by remember { mutableStateOf(initialLesson?.description ?: "") }

    var videoUrl by remember { mutableStateOf(initialLesson?.video?.url ?: "") }
    var audioUrl by remember { mutableStateOf(initialLesson?.audio?.url ?: "") }
    var audioDuration by remember { mutableStateOf(initialLesson?.audio?.duration ?: "") }
    var pdfUrl by remember { mutableStateOf(initialLesson?.pdf?.url ?: "") }
    var pdfFileName by remember { mutableStateOf(initialLesson?.pdf?.fileName ?: "") }

    var errorMessage by remember { mutableStateOf("") }

    val scrollState = rememberScrollState()
    val categoryScrollState = rememberScrollState()

    val categories = listOf("ተፍሲር", "አቂዳ", "ፊቅህ", "ሐዲስ", "ኡሱል", "አደብ", "መቃሲድ", "አጠቃላይ")

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(DarkSurfaceElevated)
                .border(1.dp, GoldPrimary.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(scrollState)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (initialLesson == null) "+ አዲስ ትምህርት ጫን" else "ትምህርቱን አስተካክል",
                        color = GoldLight,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )

                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "ዝጋ",
                            tint = TextSecondary
                        )
                    }
                }

                if (errorMessage.isNotBlank()) {
                    Text(
                        text = errorMessage,
                        color = Color(0xFFEF4444),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Lesson Number & Category
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = lessonNumber.toString(),
                        onValueChange = {
                            lessonNumber = it.toIntOrNull() ?: 1
                        },
                        label = { Text("የትምህርት ቁጥር", color = TextSecondary, fontSize = 11.sp) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.width(110.dp),
                        colors = textFieldColors()
                    )

                    OutlinedTextField(
                        value = teacher,
                        onValueChange = { teacher = it },
                        label = { Text("አስተማሪ / ኡስታዝ", color = TextSecondary, fontSize = 11.sp) },
                        modifier = Modifier.weight(1f),
                        colors = textFieldColors()
                    )
                }

                // Category Chips
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "የትምህርት ዘርፍ (Category)",
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(categoryScrollState),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        categories.forEach { cat ->
                            val isSelected = category == cat
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(
                                        if (isSelected) GoldPrimary else DarkSurface
                                    )
                                    .clickable { category = cat }
                                    .padding(horizontal = 10.dp, vertical = 5.dp)
                            ) {
                                Text(
                                    text = cat,
                                    color = if (isSelected) DarkBackground else TextSecondary,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }
                }

                // Title (Amharic)
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("የትምህርት ርዕስ (በአማርኛ) *", color = TextSecondary, fontSize = 11.sp) },
                    placeholder = { Text("ለምሳሌ፡ የፊቅህ እና የሸሪዓዊ ግንዛቤ መርሆዎች", color = TextMuted, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                // Title (Arabic)
                OutlinedTextField(
                    value = titleArabic,
                    onValueChange = { titleArabic = it },
                    label = { Text("የትምህርት ርዕስ (በአረብኛ - አማራጭ)", color = TextSecondary, fontSize = 11.sp) },
                    placeholder = { Text("أصول الفهم وفقه الأحكام الشرعية", color = TextMuted, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                // Description
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("ዝርዝር ማብራሪያ", color = TextSecondary, fontSize = 11.sp) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(90.dp),
                    colors = textFieldColors()
                )

                // Audio Details (MP3)
                Text(
                    text = "የድምፅ ትምህርት (MP3 Audio)",
                    color = GoldPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
                OutlinedTextField(
                    value = audioUrl,
                    onValueChange = { audioUrl = it },
                    label = { Text("የድምፅ ሊንክ (Audio MP3 URL)", color = TextSecondary, fontSize = 11.sp) },
                    placeholder = { Text("https://example.com/audio.mp3", color = TextMuted, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )
                OutlinedTextField(
                    value = audioDuration,
                    onValueChange = { audioDuration = it },
                    label = { Text("የድምፅ ርዝማኔ (ምሳሌ፡ 45:10 ደቂቃ)", color = TextSecondary, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                // Video Details
                Text(
                    text = "የቪድዮ ትምህርት (Video Streaming)",
                    color = GoldPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
                OutlinedTextField(
                    value = videoUrl,
                    onValueChange = { videoUrl = it },
                    label = { Text("የቪድዮ ሊንክ (Video MP4 / HLS URL)", color = TextSecondary, fontSize = 11.sp) },
                    placeholder = { Text("https://example.com/lesson.mp4", color = TextMuted, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                // PDF Details
                Text(
                    text = "የPDF ሰነድ (Document)",
                    color = GoldPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
                OutlinedTextField(
                    value = pdfUrl,
                    onValueChange = { pdfUrl = it },
                    label = { Text("የPDF ሊንክ (Document PDF URL)", color = TextSecondary, fontSize = 11.sp) },
                    placeholder = { Text("https://example.com/book.pdf", color = TextMuted, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )
                OutlinedTextField(
                    value = pdfFileName,
                    onValueChange = { pdfFileName = it },
                    label = { Text("የሰነዱ ስም (File Name)", color = TextSecondary, fontSize = 11.sp) },
                    placeholder = { Text("የጥናት መጽሐፍ ክፍል 1.pdf", color = TextMuted, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                Spacer(modifier = Modifier.height(6.dp))

                // Bottom Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("ሰርዝ", color = TextSecondary)
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Button(
                        onClick = {
                            if (title.isBlank()) {
                                errorMessage = "እባክዎን የትምህርቱን ርዕስ ያስገቡ!"
                                return@Button
                            }

                            val newLesson = Lesson(
                                id = initialLesson?.id ?: UUID.randomUUID().toString(),
                                lessonNumber = lessonNumber,
                                title = title.trim(),
                                titleArabic = if (titleArabic.isNotBlank()) titleArabic.trim() else null,
                                titleAmharic = title.trim(),
                                category = category,
                                teacher = teacher.trim(),
                                description = description.trim(),
                                video = if (videoUrl.isNotBlank()) MediaSource(type = "url", url = videoUrl.trim()) else null,
                                audio = if (audioUrl.isNotBlank()) MediaSource(
                                    type = "url",
                                    url = audioUrl.trim(),
                                    duration = if (audioDuration.isNotBlank()) audioDuration.trim() else null
                                ) else null,
                                pdf = if (pdfUrl.isNotBlank()) MediaSource(
                                    type = "url",
                                    url = pdfUrl.trim(),
                                    fileName = if (pdfFileName.isNotBlank()) pdfFileName.trim() else "ሰነድ.pdf"
                                ) else null,
                                createdAt = initialLesson?.createdAt ?: System.currentTimeMillis().toString(),
                                updatedAt = System.currentTimeMillis().toString(),
                                isBookmarked = initialLesson?.isBookmarked ?: false,
                                isCompleted = initialLesson?.isCompleted ?: false
                            )

                            onSave(newLesson)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary)
                    ) {
                        Text(
                            text = if (initialLesson == null) "ትምህርቱን ጫን" else "አስቀምጥ",
                            color = DarkBackground,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun textFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedTextColor = TextPrimary,
    unfocusedTextColor = TextPrimary,
    focusedBorderColor = GoldPrimary,
    unfocusedBorderColor = DarkBorder,
    cursorColor = GoldPrimary
)
