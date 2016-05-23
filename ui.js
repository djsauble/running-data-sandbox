/* Initialize the data-sensitive pieces of the UI */
function initUI() {
  // Configure event handlers
  document.getElementById("input").addEventListener('input', function() {
    console.log("Input changed");
  });

  // Wire up the refresh button
  document.getElementById("nav").innerHTML = "<a href='javascript:refreshData();'>Refresh cache</a>";
}
