
let allSurahs = [];

/**
 * Filters the surahs based on the search term.
 * @param {string} searchTerm - The term to search for.
 * @returns {Array} - The filtered list of surahs.
 */
function filterSurahs(searchTerm) {
    if (!searchTerm) {
        return allSurahs;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allSurahs.filter(surah => {
        const englishName = surah.englishName.toLowerCase();
        const arabicName = surah.name.toLowerCase();
        const surahNumber = surah.number.toString();
        return englishName.includes(lowerCaseSearchTerm) ||
               arabicName.includes(lowerCaseSearchTerm) ||
               surahNumber.includes(lowerCaseSearchTerm);
    });
}

/**
 * Renders the surah grid with the given surahs.
 * @param {Array} surahs - The list of surahs to render.
 */
function renderSurahGrid(surahs) {
    const existingTooltips = document.querySelectorAll('.tooltip');
    existingTooltips.forEach(tooltip => tooltip.remove());
    const surahGrid = document.getElementById("surah-grid");
    if (!surahGrid) {
        console.error("Error: surah-grid element not found in the DOM");
        return;
    }
    surahGrid.innerHTML = ''; // Clear the grid

    surahs.forEach(surah => {
        const surahDiv = document.createElement("div");
        surahDiv.classList.add("surah-item");
        const surahNumber = document.createElement("span");
        surahNumber.classList.add("surah-number");
        surahNumber.textContent = surah.number;

        const surahName = document.createElement("span");
        surahName.classList.add("surah-name");
        surahName.textContent = surah.englishName;

        const surahArabicName = document.createElement("span");
        surahArabicName.classList.add("surah-arabic-name");
        surahArabicName.textContent = surah.name;

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerHTML = `
            <span class="tooltiptext">
                <span class="tooltip-name">${surah.englishName}</span>
                <span class="tooltip-number">(${surah.number})</span>
                <span class="tooltip-type">(${surah.revelationType})</span>
                <span class="tooltip-translation">${surah.englishNameTranslation}</span>
                <span class="tooltip-ayahs">(${surah.numberOfAyahs} Ayahs)</span>
            </span>
        `;
        document.body.appendChild(tooltip);

        surahDiv.addEventListener("mouseover", (event) => {
            tooltip.style.display = "block";
            const surahDivRect = surahDiv.getBoundingClientRect();
            tooltip.style.top = `${surahDivRect.top - tooltip.offsetHeight - 5 + window.scrollY}px`;
            tooltip.style.left = `${surahDivRect.left + surahDivRect.width / 2}px`;
            tooltip.style.transform = "translateX(-50%)";
        });

        surahDiv.addEventListener("mouseout", () => {
            tooltip.style.display = "none";
        });

        surahDiv.addEventListener("click", () => {
            window.location.href = `surahs/${surah.englishName.toLowerCase().replace(/\s+/g, '-')}/${surah.englishName.toLowerCase().replace(/\s+/g, '-')}.html`;
        });

        surahDiv.appendChild(surahNumber);
        surahDiv.appendChild(surahName);
        surahDiv.appendChild(surahArabicName);

        surahGrid.appendChild(surahDiv);
    });
}

/**
 * Creates the surah grid.
 */
function createSurahGrid() {
    fetch("public/data/all_surahs.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allSurahs = data.children;
            renderSurahGrid(allSurahs);
        })
        .catch(error => {
            console.error("Error loading or processing data:", error);
        });
}

createSurahGrid();

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    const filteredSurahs = filterSurahs(searchTerm);
    renderSurahGrid(filteredSurahs);
});
