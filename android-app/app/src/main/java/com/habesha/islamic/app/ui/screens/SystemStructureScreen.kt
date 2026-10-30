package com.habesha.islamic.app.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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

@Composable
fun SystemStructureScreen() {
    val context = LocalContext.current

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 12.dp, end = 12.dp, top = 8.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
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
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(GoldPrimary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.AccountTree,
                            contentDescription = "መዋቅር",
                            tint = GoldPrimary,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Column {
                        Text(
                            text = "የሐበሻ አካዳሚ የትምህርት ሥርዓተ-መዋቅር",
                            color = GoldLight,
                            fontSize = 15.5.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "በቁርዓን እና በሐዲስ መመሪያ ላይ የተመሰረተ ደረጃውን የጠበቀ ስርዓተ-ትምህርት",
                            color = TextSecondary,
                            fontSize = 11.5.sp
                        )
                    }
                }
            }
        }

        // 5 Pillars Section
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "5ቱ ዋና ዋና የትምህርት ማዕዘናት",
                    color = GoldPrimary,
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold
                )

                val pillars = listOf(
                    PillarItem(
                        number = "፩",
                        titleAmharic = "አል-ቁርዓን ወተፍሲሩሁ (የቁርዓን ጥናትና ተፍሲር)",
                        titleArabic = "القرآن الكريم وعلومه وتفسيره",
                        description = "የቁርዓን አንቀጾች ትርጓሜ፣ የተወረዱበት ምክንያት፣ የአንቀጾች ቅደም-ተከተል እና የቋንቋ ማብራሪያ::",
                        icon = Icons.Default.MenuBook
                    ),
                    PillarItem(
                        number = "፪",
                        titleAmharic = "አል-ሐዲስ ወኡሉሙሁ (የሐዲስ ሳይንስ እና ማብራሪያ)",
                        titleArabic = "الحديث النبوي الشريف ومصطلحه",
                        description = "የነብዩ (ሰ.ዐ.ወ) ንግግሮች፣ ተግባራትና ማረጋገጫዎች፣ የሰነድ ምርመራ እና የሐዲስ ጥናት ደንቦች::",
                        icon = Icons.Default.AutoStories
                    ),
                    PillarItem(
                        number = "፫",
                        titleAmharic = "አል-አቂዳ ወተውሂድ (እስላማዊ እምነትና አሀዳዊነት)",
                        titleArabic = "العقيدة الإسلامية والتوحيد الخالص",
                        description = "ትክክለኛው የአህለሱና ወልጀማዓ የእምነት መሰረት፣ የአላህ ስሞችና ባህሪያት፣ እና የኢማን ማዕዘናት::",
                        icon = Icons.Default.Shield
                    ),
                    PillarItem(
                        number = "፬",
                        titleAmharic = "አል-ፊቅህ ወኡሱሉሁ (እስላማዊ ህግጋትና መርሆዎች)",
                        titleArabic = "الفقه الإسلامي وأصول الأحكام",
                        description = "የኢባዳ (አምልኮ) እና የሙዓመላት (ማህበራዊና የኢኮኖሚ ግንኙነት) ድንጋጌዎችና የሸሪዓዊ ምንጮች::",
                        icon = Icons.Default.Gavel
                    ),
                    PillarItem(
                        number = "፭",
                        titleAmharic = "አል-አደብ ወተዝኪያ (ስነ-ምግባር እና የልብ ንፅህና)",
                        titleArabic = "الأدب الإسلامي وتزكية النفوس",
                        description = "የሙስሊም ስብዕና፣ ስነ-ምግባር፣ የልብ ህመሞች ህክምናና መንፈሳዊ እድገት::",
                        icon = Icons.Default.Favorite
                    )
                )

                pillars.forEach { pillar ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(DarkSurfaceElevated)
                            .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
                            .padding(12.dp)
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(GoldPrimary.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = pillar.icon,
                                    contentDescription = pillar.titleAmharic,
                                    tint = GoldPrimary,
                                    modifier = Modifier.size(18.dp)
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = pillar.titleAmharic,
                                    color = TextPrimary,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp
                                )
                                Text(
                                    text = pillar.titleArabic,
                                    color = GoldLight,
                                    fontSize = 11.5.sp,
                                    fontFamily = FontFamily.Serif
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = pillar.description,
                                    color = TextSecondary,
                                    fontSize = 11.5.sp,
                                    lineHeight = 16.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        // Telegram Channel Link
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(TelegramCyan.copy(alpha = 0.12f))
                    .border(1.dp, TelegramCyan.copy(alpha = 0.35f), RoundedCornerShape(12.dp))
                    .clickable {
                        val intent = Intent(
                            Intent.ACTION_VIEW,
                            Uri.parse("https://t.me/habesha_islamic_academy")
                        )
                        try {
                            context.startActivity(intent)
                        } catch (_: Exception) {}
                    }
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Send,
                            contentDescription = "ቴሌግራም",
                            tint = TelegramCyan,
                            modifier = Modifier.size(24.dp)
                        )
                        Column {
                            Text(
                                text = "ቴሌግራም ቻናላችንን ይቀላቀሉ",
                                color = TextPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                            Text(
                                text = "አዳዲስ ትምህርቶችና የPDF መጽሐፍት ሲወጡ በቀጥታ ይከታተሉ",
                                color = TextSecondary,
                                fontSize = 11.sp
                            )
                        }
                    }
                    Text(
                        text = "ተቀላቀል →",
                        color = TelegramCyan,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }
        }
    }
}

private data class PillarItem(
    val number: String,
    val titleAmharic: String,
    val titleArabic: String,
    val description: String,
    val icon: ImageVector
)
