export class Grid {
    constructor() {
        this.selectedCells = [];
        this.isDragging = false;
    }

    renderGrid(xAxis, yAxis, wordgrid) {
        const gridArea = document.getElementsByClassName("grid-area")[0];
        gridArea.innerHTML = "";

        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");

        let index = 0;
        for (let i = 0; i < xAxis; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < yAxis; j++) {
                const cell = document.createElement("td");
                const char = wordgrid[index++] || " ";
                cell.textContent = char;

                cell.dataset.x = i;
                cell.dataset.y = j;

                cell.addEventListener("mousedown", () => this.startDrag(cell));
                cell.addEventListener("mouseenter", () => this.dragOver(cell));
                cell.addEventListener("mouseup", () => this.endDrag());

                row.appendChild(cell);
            }

            tblBody.appendChild(row);
        }

        tbl.appendChild(tblBody);
        gridArea.appendChild(tbl);

        // Handle mouse up outside the grid
        document.addEventListener("mouseup", () => this.endDrag());
    }

    startDrag(cell) {
        this.isDragging = true;
        this.clearSelection();
        this.selectCell(cell);
    }

    dragOver(cell) {
        if (!this.isDragging || this.selectedCells.includes(cell)) return;

        const lastCell = this.selectedCells[this.selectedCells.length - 1];
        const x1 = parseInt(lastCell.dataset.x);
        const y1 = parseInt(lastCell.dataset.y);
        const x2 = parseInt(cell.dataset.x);
        const y2 = parseInt(cell.dataset.y);

        const dx = x2 - x1;
        const dy = y2 - y1;


        if (this.selectedCells.length === 1) {
            this.direction = { dx, dy };
        } else if (this.direction) {
            const expectedX = x1 + this.direction.dx;
            const expectedY = y1 + this.direction.dy;
            if (x2 !== expectedX || y2 !== expectedY) {
                return; 
            }
        }

        this.selectCell(cell);
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;

        const selectedWord = this.selectedCells.map(c => c.textContent).join("");

        if (window.validWords.includes(selectedWord)) {
            this.selectedCells.forEach(c => {
                c.classList.add("found");
                c.classList.remove("selected");
            });
        } else {
            this.clearSelection();
        }

        this.selectedCells = [];
    }

    selectCell(cell) {
        cell.classList.add("selected");
        this.selectedCells.push(cell);
    }

    clearSelection() {
        this.selectedCells.forEach(c => c.classList.remove("selected"));
        this.selectedCells = [];
    }
}
