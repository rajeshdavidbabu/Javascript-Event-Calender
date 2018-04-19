// Note: The code was aimed at readability more than performance. Eg: forEach was used in place of
// normal for loop which is the faster. ES6 practice is used wherever possible.

// Create the calender event based on the arguments passed.
var createEvent = (obj) => {
  let node = document.createElement("DIV");
  node.className = "common-frame event";
  node.innerHTML = 
  "<div class='title'> Sample Item </div><div class='location'> Sample Location </div>";
  Object.assign(node.style, obj);
  // Render the event onto the calender when its ready.
  document.getElementById("calender").appendChild(node);
}

// Convert the 2-dimensional event information array into HTML DOM.
var renderEvents = (columns) => {
  let left = 0, 
      height = 0, 
      top = 0, 
      width = CONTAINER_WIDTH, 
      n = columns.length;
  // Render the events stored in a two dimensional array.
  columns.forEach((column, i) => {
    left = (i / n)*CONTAINER_WIDTH + DEFAULT_LEFT_OFFSET;  // Common for all non-colliding overlapping items.
    column.forEach((event, j) => {
      height = event.end - event.start; // Height of the event element
      top = event.start;                // Offset from the top.
      width = (CONTAINER_WIDTH/n);       // Width based on number of overlapping items.
      createEvent({height, top, left, width});
    })
  })
}

// Identifying colliding-overlapping events
var collisionDetection = (a, b) => {
  return a.end > b.start && a.start < b.end;
}

// Core logic which prepares the event data.
var layOutDay = (events) => {
  // Reset the html DOM and event data.
  let calender = document.getElementById("calender");
  calender.innerHTML = '',
  columns = [],
  previousHighestEndValue = null,
  isInserted = false;
  // Sort it by starting time, and then by ending time.
  events = events.sort((a,b) => {
    return a.start - b.start || b.end - a.end;
  });
  // Iterate over the sorted array
  events.forEach((e, index) => {
    // Indicates that this event has not been arranged on the calender
    isInserted = false;
    // The new incoming event is non-colliding and non-overlapping in nature to the last event.
    // Hence, we can render the previously stored events and no longer need to consider them for 
    // further iterations.
    if (previousHighestEndValue !== null && e.start >= previousHighestEndValue) {
      renderEvents(columns);
      columns = [];
      previousHighestEndValue = null;
    }
    // Check if this can be inserted in a non-colliding manner to any of the previous events.
    for (let i = 0, il = columns.length; i < il; i++) {
      // Check if the incoming event has a collision with the last placed event starting first row.      
      if (!collisionDetection(columns[i].slice(-1)[0], e)) {
        // Sorted events enable to find any available non-colliding arrangement with previous events.
        columns[i].push(e);
        isInserted = true;
        break;
      }
    }
    // If no non-colliding arrangement can be found with existing events.
    // Arrange in a new column adjacent to it.
    if (!isInserted) {
      columns.push([e]);
    }
    // previousHighestEndValue enabled us to identify if events belong to an
    // overlapping group, where all events have atleast one event overlapping them.
    if (previousHighestEndValue === null || e.end > previousHighestEndValue) {
      previousHighestEndValue = e.end;
    }
  });
  // Render the last saved event/event group.
  if (columns.length) {
    renderEvents(columns);
  }
}

