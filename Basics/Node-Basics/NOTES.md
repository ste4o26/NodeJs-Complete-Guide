When data is submited to the server node register an event and when this event executes 
node creates a stream which pushes the already read data(chunks of data)
into a so called buffer and once the data reaches that buffer only then we can start working with it.
That because node doesnt know if the data will be a single input field like now,
some bigger form or even a file which to be wrote down on the server hard drive which is a slowly opperation for sure.
preview lecture 33 and 34 of the course if forget.


