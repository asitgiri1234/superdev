# Notes

## Summary of changes

Search was applying `archived` and `status` to only one side of an `OR`, so archived tasks leaked into the list and the status dropdown did not really filter title matches. I grouped the title/description match and applied both filters to the whole predicate, in the Java query, `db/queries/search_tasks.sql`, and the Oracle package. `%` and `_` in the search box are now treated as literal characters.

The API also slept longer for shorter text (up to one second on a blank search) on the request thread. That delay is gone. An unknown status now returns 400 instead of a 500. `page` and `pageSize` below 1 return 400 so pagination cannot crash.

On the frontend, typing resets to page 1 and waits 300ms before calling the API. An older response cannot overwrite a newer one. A failed request clears the spinner and shows the error, and the next request clears that error.

## What I chose not to change

Java still loads every matching row and slices the page in memory. The sample set is small, and moving pagination into SQL would be a wider change. I did not add sorting, new endpoints, or a logging migration beyond this one search log line.

## Biggest remaining risk

The in-memory page slice will get slow and memory-heavy as the table grows. The Oracle package already paginates in SQL, so those two paths can drift.

## Tools

I used Cursor to read the frontend, backend, and SQL together and to draft the fixes. I traced a blank search and a status filter through the query myself, then checked the running API.
