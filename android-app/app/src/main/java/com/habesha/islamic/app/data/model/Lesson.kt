package com.habesha.islamic.app.data.model

import com.google.gson.annotations.SerializedName

data class MediaSource(
    @SerializedName("type") val type: String = "url", // "upload" or "url"
    @SerializedName("url") val url: String = "",
    @SerializedName("fileName") val fileName: String? = null,
    @SerializedName("sizeBytes") val sizeBytes: Long? = null,
    @SerializedName("duration") val duration: String? = null,
    @SerializedName("localPath") val localPath: String? = null
)

data class Lesson(
    @SerializedName("id") val id: String = "",
    @SerializedName("lessonNumber") val lessonNumber: Int = 1,
    @SerializedName("title") val title: String = "",
    @SerializedName("titleArabic") val titleArabic: String? = null,
    @SerializedName("titleAmharic") val titleAmharic: String? = null,
    @SerializedName("category") val category: String = "አጠቃላይ",
    @SerializedName("teacher") val teacher: String = "",
    @SerializedName("description") val description: String = "",
    @SerializedName("video") val video: MediaSource? = null,
    @SerializedName("audio") val audio: MediaSource? = null,
    @SerializedName("pdf") val pdf: MediaSource? = null,
    @SerializedName("createdAt") val createdAt: String = "",
    @SerializedName("updatedAt") val updatedAt: String = "",
    @SerializedName("isBookmarked") val isBookmarked: Boolean = false,
    @SerializedName("isCompleted") val isCompleted: Boolean = false
)

enum class MainNavTab {
    LESSONS,    // የትምህርቶች ማውጫ
    DOCUMENTS,  // የሰነዶች ማዕከል
    AUDIO,      // የድምፅ ትምህርቶች (MP3)
    OFFLINE,    // ከመስመር ውጭ (Offline)
    STRUCTURE   // የስርዓቱ መዋቅር
}
