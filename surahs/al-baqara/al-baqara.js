document.addEventListener('DOMContentLoaded', () => {
    const surahId = 'al-baqara'; // Set the surah ID
    const surahTitle = document.getElementById('surah-title');

    fetch('/data/all_surahs.json')
        .then(response => response.json())
        .then(allSurahs => {
            const surah = allSurahs.children.find(s => s.englishName.toLowerCase().replace(/\s+/g, '-') === surahId);
            if (surah) {
                // Update the title with the surah name
                surahTitle.textContent = `Mindmap for Surah ${surah.englishName} (${surah.name})`;
                document.title = `Mindmap for Surah ${surah.englishName}`;
            }
        })
        .catch(error => console.error('Error loading all_surahs.json:', error));
});