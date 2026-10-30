package com.habesha.islamic.app.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.habesha.islamic.app.data.model.MainNavTab
import com.habesha.islamic.app.ui.theme.DarkBackground
import com.habesha.islamic.app.ui.theme.DarkBorder
import com.habesha.islamic.app.ui.theme.DarkSurface
import com.habesha.islamic.app.ui.theme.GoldDark
import com.habesha.islamic.app.ui.theme.GoldLight
import com.habesha.islamic.app.ui.theme.GoldPrimary
import com.habesha.islamic.app.ui.theme.TelegramCyan
import com.habesha.islamic.app.ui.theme.TextPrimary
import com.habesha.islamic.app.ui.theme.TextSecondary

@Composable
fun TopNavBar(
    selectedTab: MainNavTab,
    onTabSelected: (MainNavTab) -> Unit,
    onAddClick: () -> Unit
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(DarkBackground)
            .padding(top = 8.dp, bottom = 4.dp)
    ) {
        // Top Brand Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Logo / Title
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(listOf(GoldLight, GoldPrimary, GoldDark))
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "ح",
                        color = DarkBackground,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "ሐበሻ (الفهم)",
                        color = GoldPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                    Text(
                        text = "ኢስላማዊ የትምህርት መድረክ",
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }

            // Action Buttons: "+ ይዘት ጫን" and "ቴሌግራም"
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                // Add Content Button
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            Brush.horizontalGradient(listOf(GoldDark, GoldPrimary))
                        )
                        .clickable { onAddClick() }
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "ይዘት ጫን",
                        tint = DarkBackground,
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "ይዘት ጫን",
                        color = DarkBackground,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }

                // Telegram Button
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(TelegramCyan.copy(alpha = 0.2f))
                        .clickable {
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://t.me/habesha_islamic_academy")
                            )
                            try {
                                context.startActivity(intent)
                            } catch (_: Exception) {}
                        }
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "ቴሌግራም",
                        tint = TelegramCyan,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "ቴሌግራም",
                        color = TelegramCyan,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 12.sp
                    )
                }
            }
        }

        // Horizontal Category Tabs (as shown in the screenshots)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(scrollState)
                .padding(horizontal = 12.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val tabs = listOf(
                MainNavTab.LESSONS to "የትምህርቶች ማውጫ",
                MainNavTab.DOCUMENTS to "የሰነዶች ማዕከል",
                MainNavTab.AUDIO to "የድምፅ ትምህርቶች (MP3)",
                MainNavTab.OFFLINE to "ከመስመር ውጭ (Offline)",
                MainNavTab.STRUCTURE to "የስርዓቱ መዋቅር"
            )

            tabs.forEach { (tab, label) ->
                val isSelected = selectedTab == tab
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (isSelected) GoldPrimary.copy(alpha = 0.18f) else DarkSurface
                        )
                        .clickable { onTabSelected(tab) }
                        .padding(horizontal = 12.dp, vertical = 7.dp)
                ) {
                    Text(
                        text = label,
                        color = if (isSelected) GoldPrimary else TextSecondary,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        fontSize = 12.5.sp
                    )
                }
            }
        }
    }
}
