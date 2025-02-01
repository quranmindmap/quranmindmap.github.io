document.addEventListener('DOMContentLoaded', () => {
    const surahId = location.pathname.split('/').slice(-1)[0].replace('.html', '');
    const surahTitle = document.getElementById('surah-title'); // Get the h1 element

  fetch('../../data/all_surahs.json')
    .then(response => response.json())
    .then(allSurahs => {
      const surah = allSurahs.children.find(s => s.englishName.toLowerCase().replace(/\s+/g, '-') === surahId);
      if (surah) {
       surahTitle.textContent = `Mindmap for Surah ${surah.englishName} (${surah.name})`; // Update title
        document.title = `Mindmap for Surah ${surah.englishName}`; // Update page title
      }
    });

    fetch('../../data/surah_summaries.json')
        .then(response => response.json())
        .then(summaries => {
            const surahSummary = summaries.find(s => s.id === surahId);

            const mindmapData = {
                "meta": {
                    "name": surahId,
                    "author": "Your Name",
                    "version": "0.1"
                },
                "format": "node_tree",
                "data": {
                    "id": "root",
                    "topic": surahId,
                    "children": surahSummary ? [
                        {
                            "id": surahId + "-summary",
                            "topic": surahSummary.summary,
                            "direction": "right",
                            "expanded": true
                        }
                    ] : []
                }
            };

            const options = {
                container: 'mindmap',
                editable: false,
                theme: 'default'
            };

            const jm = new jsMind(options);
            jm.show(mindmapData);
        })
        .catch(error => console.error('Error loading data:', error));
});
