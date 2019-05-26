  chrome.webNavigation.onCompleted.addListener(handlePsdVisit,
	{url: [{hostEquals : 'pesstatsdatabase.com', pathSuffix: 'Player_old2011.php'}]}
  );
  
  
  function handlePsdVisit() {
	  //
  }