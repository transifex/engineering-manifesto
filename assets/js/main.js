(function() {
  var TEM = window.TEM || {};

  TEM.make_toc = function() {
    var headings = document.querySelectorAll('main h2'),
        toc_element = document.getElementById('toc'),
        toc_contents = document.querySelector('.js-toc-contents'),
        html_result = '';

    if (!headings.length) return;
    headings.forEach(function(item) {
      var text = item.innerText,
          id = item.id;
      html_result += '<li><a href="#' + id + '">' + text + '</a></li>';
    });

    if (!html_result || !toc_element) return;

    document.body.classList.add('toc-visible')
    toc_contents.innerHTML = html_result;
  };

  TEM._init = function() {
    TEM.make_toc();
  };

  TEM._init();
})();
