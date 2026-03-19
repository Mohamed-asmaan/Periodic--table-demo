/**
 * appFunc.js - Periodic Table Grid Rendering
 * =========================================
 * Renders the periodic table grid from ELEMENTS array (elements-data.js).
 * Run BEFORE app.js (load order in index.html).
 * - getElementCategory: maps element to category for CSS color (alkali, halogen, etc.)
 * - renderElement: builds 18x10 grid, fills cells with symbol + atomic number
 */

// Elements data from elements-data.js (must be loaded first)
let elements = ELEMENTS;
let periodicTableGrid = document.getElementById('periodicTable');

/**
 * Returns element category for CSS styling (IUPAC-style colors).
 * Uses atomic number and group to determine: alkali, alkaline-earth, transition, etc.
 */
function getElementCategory(el) {
    const n = el.atomicNumber;
    const g = el.group;
    if (n === 1) return 'nonmetal';
    if (g === 1) return 'alkali';
    if (g === 2) return 'alkaline-earth';
    if (g >= 3 && g <= 12) return 'transition';
    if (n >= 57 && n <= 71) return 'lanthanide';
    if (n >= 89 && n <= 103) return 'actinide';
    if (g === 17) return 'halogen';
    if (g === 18) return 'noble-gas';
    if ([5, 14, 32, 33, 51, 52, 84].includes(n)) return 'metalloid';
    if (g >= 13 && g <= 16) return 'post-transition';
    return 'post-transition';
}


/**
 * Renders the periodic table grid.
 * - Builds lookup map: (xpos, ypos) -> element
 * - Loops 18 cols x 10 rows (standard layout)
 * - Empty cells: visibility hidden (keeps grid alignment)
 * - Cells get: element-cell, cat-{category}, data-symbol for search/filter
 */
function renderElement() {
    const grid = {};

    elements.forEach(el => {
        let keyName = `${el.xpos}-${el.ypos}`;
        grid[keyName] = el;
    });

    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 18; j++) {
            const key = `${j}-${i}`;
            const element = grid[key];

            const cell = document.createElement("div");
            cell.setAttribute('role', 'gridcell');
            cell.dataset.symbol = element ? element.symbol : '';

            if (element) {
                const category = getElementCategory(element);
                cell.className = `element-cell cat-${category}`;
                cell.innerHTML = `
                <span class="element-symbol">${element.symbol}</span>
                <span class="element-number">${element.atomicNumber}</span>
            `;
            } else {
                cell.style.visibility = "hidden"; // Empty grid positions
            }

            periodicTableGrid.appendChild(cell);
        }
    }
}

// Run on load - table is built when DOM is ready
renderElement();

