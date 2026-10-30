package com.habesha.islamic.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.habesha.islamic.app.data.model.MainNavTab
import com.habesha.islamic.app.ui.theme.DarkBackground
import com.habesha.islamic.app.ui.theme.DarkBorder
import com.habesha.islamic.app.ui.theme.GoldLight
import com.habesha.islamic.app.ui.theme.GoldPrimary
import com.habesha.islamic.app.ui.theme.TextMuted
import com.habesha.islamic.app.ui.theme.TextSecondary

@Composable
fun BottomNavBar(
    selectedTab: MainNavTab,
    onTabSelected: (MainNavTab) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(DarkBackground)
            .border(width = 0.5.dp, color = DarkBorder)
            .padding(vertical = 6.dp, horizontal = 4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            val navItems = listOf(
                NavigationItem(MainNavTab.LESSONS, "ትምህርቶች", Icons.Default.MenuBook),
                NavigationItem(MainNavTab.DOCUMENTS, "ሰነዶች", Icons.Default.Description),
                NavigationItem(MainNavTab.AUDIO, "ድምፆች", Icons.Default.Headphones),
                NavigationItem(MainNavTab.OFFLINE, "ካዝና (Offline)", Icons.Default.CloudDone),
                NavigationItem(MainNavTab.STRUCTURE, "መዋቅር", Icons.Default.AccountTree)
            )

            navItems.forEach { item ->
                val isSelected = selectedTab == item.tab
                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .clickable { onTabSelected(item.tab) }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(3.dp)
                ) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label,
                        tint = if (isSelected) GoldPrimary else TextMuted,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = item.label,
                        color = if (isSelected) GoldLight else TextSecondary,
                        fontSize = 10.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                }
            }
        }
    }
}

private data class NavigationItem(
    val tab: MainNavTab,
    val label: String,
    val icon: ImageVector
)
