let memorySlots = []; // Memory slots
let fifoQueue = []; // FIFO queue
let pageSequence = []; // Input page sequence
let currentPageIndex = 0;
let intervalId = null;
let isPaused = false; // Tracks the pause state

// Initialize and start the animation
function initializeAnimation() {
  const input = document.getElementById("pageSequence").value;
  const memorySize = parseInt(document.getElementById("memorySize").value, 10);

  if (input) {
    pageSequence = input.split(",").map(Number);
  } else if (pageSequence.length === 0) {
    pageSequence = [7, 0, 1, 2, 0, 3, 0, 4]; // Default sequence
  }

  resetAnimation(memorySize);
  startAnimation(memorySize);
}

// Start or resume the animation
function startAnimation(memorySize) {
  intervalId = setInterval(() => animateNextPage(memorySize), 1000);
}

// Pause or resume the animation
function togglePauseResume() {
  const pauseResumeButton = document.getElementById("pauseResumeButton");
  if (isPaused) {
    // Resume
    isPaused = false;
    pauseResumeButton.textContent = "Pause";
    startAnimation(memorySlots.length);
  } else {
    // Pause
    isPaused = true;
    pauseResumeButton.textContent = "Resume";
    clearInterval(intervalId);
  }
}

// Reset the animation
function resetAnimation(memorySize) {
  clearInterval(intervalId);
  memorySlots = Array(memorySize).fill(null);
  fifoQueue = [];
  currentPageIndex = 0;
  isPaused = false;

  // Reset button text
  const pauseResumeButton = document.getElementById("pauseResumeButton");
  pauseResumeButton.textContent = "Pause";

  // Clear and rebuild the memory table dynamically
  const memoryBody = document.getElementById("memory-body");
  const headerRow = document.getElementById("tableHeader");
  memoryBody.innerHTML = "";
  headerRow.innerHTML = `<th>Pages</th>`;

  pageSequence.forEach((page) => {
    const col = document.createElement("th");
    col.textContent = page; // Add page numbers to the header
    headerRow.appendChild(col);
  });

  // Create rows for memory slots (dynamic based on memory size)
  for (let i = 0; i < memorySize; i++) {
    const row = document.createElement("tr");
    row.id = `row-${i}`;
    const rowHeader = document.createElement("td");
    rowHeader.textContent = `Memory ${i + 1}`; // Label for the memory row
    row.appendChild(rowHeader);
    memoryBody.appendChild(row);
  }
}

// Handle the next page in the sequence
function animateNextPage(memorySize) {
  if (currentPageIndex >= pageSequence.length) {
    clearInterval(intervalId);
    alert("Animation Complete!");
    return;
  }

  const page = pageSequence[currentPageIndex];
  const pageIndex = memorySlots.indexOf(page);
  let pageFault = false;

  if (pageIndex === -1) {
    // Page fault
    pageFault = true;
    if (fifoQueue.length < memorySize) {
      // Add page to memory and queue
      fifoQueue.push(page);
      memorySlots[fifoQueue.length - 1] = page;
    } else {
      // Replace the oldest page
      const oldestPage = fifoQueue.shift();
      const replaceIndex = memorySlots.indexOf(oldestPage);
      fifoQueue.push(page);
      memorySlots[replaceIndex] = page;
    }
  }

  updateMemoryDisplay(pageFault, page);
  currentPageIndex++;
}

// Update the memory table on the screen
function updateMemoryDisplay(pageFault, page) {
  for (let i = 0; i < memorySlots.length; i++) {
    const row = document.getElementById(`row-${i}`);
    const cell = document.createElement("td");
    cell.textContent = memorySlots[i] !== null ? memorySlots[i] : "-";

    if (memorySlots[i] === page) {
      cell.className = pageFault ? "page-fault" : "page-hit";
    }

    row.appendChild(cell);
  }
}
