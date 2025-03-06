setTimeout(() => {
  // Purchase History Report
  const purchaseHistoryChart = new Chart(document.getElementById('purchaseHistoryChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: [
        'Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20',
        'Jan 25', 'Feb 1', 'Feb 5', 'Feb 10', 'Feb 15',
        'Feb 20', 'Feb 25', 'Mar 1', 'Mar 5', 'Mar 10',
        'Mar 15', 'Mar 20', 'Mar 25', 'Apr 1', 'Apr 5',
        'Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'May 1'
      ],
      datasets: [{
        label: 'Number of Purchases',
        data: [
          10, 12, 15, 18, 20, 22, 25, 28, 30, 32,
          35, 38, 40, 42, 45, 48, 50, 52, 55, 58,
          60, 62, 65, 68, 70
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Purchase History Report'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  
  // Favourite Products Report
  const favouriteProductsChart = new Chart(document.getElementById('favouriteProductsChart').getContext('2d'), {
    type: 'pie',
    data: {
      labels: [
        'Sofa', 'Bed', 'Chair', 'Desk', 'Table',
        'Bookshelf', 'TV', 'Lamp', 'Rug', 'Curtains',
        'Fridge', 'Oven', 'Dishwasher', 'Washing Machine',
        'Dryer', 'Microwave', 'Toaster', 'Blender',
        'Coffee Maker', 'Vacuum Cleaner'
      ],
      datasets: [{
        label: 'Favourite Products',
        data: [
          20, 30, 15, 10, 25, 18, 22, 12, 8, 15,
          10, 12, 8, 10, 12, 8, 10, 12, 8, 10,
          12, 8
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Favourite Products Report'
      }
    }
  });
  
  // Suggested Products Report
  const suggestedProductsChart = new Chart(document.getElementById('suggestedProductsChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: [
        'Sofa', 'Bed', 'Chair', 'Desk', 'Table',
        'Bookshelf', 'TV', 'Lamp', 'Rug', 'Curtains',
        'Fridge', 'Oven', 'Dishwasher', 'Washing Machine',
        'Dryer', 'Microwave', 'Toaster', 'Blender',
        'Coffee Maker', 'Vacuum Cleaner'
      ],
      datasets: [{
        label: 'Suggested Products',
        data: [
          15, 20, 12, 18, 10, 22, 18, 12, 15, 20,
          18, 15, 20, 12, 18, 10, 22, 18, 12, 15,
          20, 18
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Suggested Products Report'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}
