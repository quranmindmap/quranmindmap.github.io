document.addEventListener('DOMContentLoaded', () => {
    // Get the last part of the pathname, which should be the surah directory name
    const surahId = window.location.pathname.split('/').pop();

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

    // Fetch the mindmap data for the current Surah
    fetch('../../data/surah_summaries.json')
        .then(response => response.json())
        .then(summaries => {
            const surahSummary = summaries.find(s => s.id === surahId);
            if (surahSummary && surahSummary.mindmap) {
                let mermaidCode = 'graph TD\n';

                // Function to add indentation for children nodes
                function addIndentation(level) {
                    let indent = '';
                    for (let i = 0; i < level; i++) {
                        indent += '  ';
                    }
                    return indent;
                }

                // Function to generate Mermaid code recursively
                function generateMermaidCode(node, level = 0) {
                    const indent = addIndentation(level);
                    mermaidCode += `${indent}${node.id}("${node.topic}")\n`;

                    if (node.parentId) {
                        mermaidCode += `${indent}${node.parentId} --> ${node.id}\n`;
                    }

                    if (node.children) {
                        node.children.forEach(child => {
                            generateMermaidCode(child, level + 1);
                        });
                    }
                }

                // Generate Mermaid code from the mindmap data
                generateMermaidCode(surahSummary.mindmap[0]); // Start with the root node

                const mermaidDiv = document.getElementById('mermaid-container');
                mermaidDiv.innerHTML = mermaidCode;

                // Render the Mermaid diagram after setting the content
                mermaid.init(undefined, mermaidDiv);
            }
        })
        .catch(error => console.error('Error loading data:', error));
});