// Default input value.
let inputEvents=[{start:30,end:150},{start:540,end:600},{start:560,end:620},{start:610,end:670}];

// Main function Call.
layOutDay(inputEvents);

// Generate random tests by assuming the calender maximum value as 720.
function generateMockEvents (n) {
  let events = [];
  while (n > 0) {
    let start = Math.floor(Math.random() * CONTAINER_HEIGHT)
    let end = start + Math.floor(Math.random() * (CONTAINER_HEIGHT - start));
    events.push({start, end})
    n --;
  }
  return events;
}

// Event listener for randomize button.
document.getElementById('randomize').addEventListener('click', function() {
  layOutDay(generateMockEvents(Math.floor(Math.random() * 25) + 1 ));
});