import pandas as pd 
import xml.etree.ElementTree as ET
import sys

def get_failing_tests_and_suites( filename):
	root = ET.parse( filename).getroot()
	# we already know the shape of the tree so we can just hardcode this
	failing_tests = []
	failing_suites = []
	for ts in root:
		for t in ts:
			if ts.attrib["failures"] == "1":
				failing_tests += [t.attrib["name"]]
				failing_suites += [ts.attrib["file"]]
			for e in t:
				if e.tag == "failure":
					failing_tests += [t.attrib["name"]]
					failing_suites += [ts.attrib["file"]]
	return( (failing_tests, failing_suites))

def print_DF_to_file( df, filename):
	f = open(filename, 'w');
	f.write(df.to_csv(index = False, header=False))
	f.close()

def main():
	(failing_tests, failing_suites) = get_failing_tests_and_suites("test-results.xml")
	print_DF_to_file(pd.DataFrame(failing_tests).drop_duplicates(), "affected_test_descs.txt")
	print_DF_to_file(pd.DataFrame(failing_suites).drop_duplicates(), "test_list.txt")

main()
