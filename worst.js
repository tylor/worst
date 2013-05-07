(function() { 
  var key = document.querySelectorAll('.cbccomments')[0].id;
  var instance = CBC.APP.Instances.get(key);
  var request = [];
  var defaults = {
    number_of_items: 0,
    number_of_pages: 0,
    number_per_page: 10,
    current_page: 1,
    anchor: "",
    sort: 0
  }

  // Take over default browseComments function.
  instance.browseComments = function (a) {
    instance.initLoadingState();
    request = [];
    instance.formLowestRatedCommentsRequest({
      onpage: a.onpage ? a.onpage : 1,
      sort: a.sort ? a.sort : defaults.sort,
      number_per_page: a.number_per_page ? a.number_per_page : defaults.number_per_page,
    });
    PluckSDK.SendRequests(request, function (b) {
      "OK" == b[0].ResponseStatus.StatusCode ? (instance.terminateLoadingState(), instance.drawComments(b[0]), instance.updateNodesHeight()) : instance.browseComments(a)
    })
  };

  // Based on formCommentsRequest.
  instance.formLowestRatedCommentsRequest = function (a) {
    a && a.onpage && (defaults.current_page = a.onpage);
    a && a.number_per_page && (defaults.number_per_page = a.number_per_page);
    a && (a.sort && !a.threadpath) && (defaults.sort = a.sort);
    a = new PluckSDK.CommentsPageRequest({
      ItemsPerPage: a && a.replies_per_page ? a.replies_per_page : defaults.number_per_page,
      CommentedOnKey: new PluckSDK.ExternalResourceKey({
        Key: key.replace('sm_', '')
      }),
      OneBasedOnPage: defaults.current_page,
      SortType: new PluckSDK.ScoreSort({
        ScoreId: "Thumbs",
        ScoreSortColumn: PluckSDK.ScoreSortColumn.DeltaScore,
        SortOrder: PluckSDK.SortOrder.Ascending
      }),
      FilterType: new PluckSDK.ThreadFilter({
        ThreadPath: a && a.threadpath ? a.threadpath : "/"
      })
    });
    request.push(a)
  };

  instance.browseComments({
    onpage: 1,
    sort: 0
  });

})();
