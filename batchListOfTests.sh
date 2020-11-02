#!/bin/bash

# if the output files already exist, move them to avoid accidentally appending the new 
# data and therefore polluting it
if test -f "$4"; then
	mv $4 `echo $4"_old"`
fi
if test -f "$5"; then
	mv $5 `echo $5"_old"`
fi

warmups=0
if (( "$#" > 5 )); then
	warmups=$6
fi

for (( x=0; x<$warmups; x++ )); do
	echo "Warmup run: "$x" of "$warmups
	# run some tests into the void 
	npm run test
done

# note: we're only running the main and bin tests
# this is because we've previously determined that the react and renderer tests 
# do not execute any of our affected code
# also, the linter breaks and there's no need to run coverage tests as they don't make
# sense to use as a timing metric
for x in $(eval echo {1..$1}); do
	echo "Running test suite: " $x
	npm run test $(cat $3) >> $4
	python process_junit_xml_out.py $5
	echo "Done running test suite, cleaning up now..."
	rm -rf /tmp/*
done
