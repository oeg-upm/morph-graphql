#!/bin/python
import argparse
import re
import json
import os
import rdflib
import time

def execute_query(query):
    g = rdflib.Graph()

    print("parsing ...")
    g.parse("/Users/freddy/Downloads/1Ksmall.nt", format="nt")

    print("querying ...")
    f = open("/Users/freddy/morph-graphql/examples/LinGBM/queries/sparql-queries/1K/q1/1264.rq", "r")
    query = f.read()
    print("query= " + str(query))

    qres = g.query(query)

    for row in qres:
        print("%s = " + str(row))

    print("bye")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--json_config", required=True, help="Input config file with yarrrml and csvw")
    args = parser.parse_args()
    with open(args.json_config, "r") as json_file:
        config = json.load(json_file)
    g = rdflib.Graph()

    for query in config:

        for size in config[query]:
            g.parse("./"+size+"/"+size+".nt", format="nt")
            for index in range(len(config[query][size])):
                path = "./"+size+"/"+query+"/"+str(index)+ ".rq"
                with open(path, "r") as file:
                    content = file.read()

                for i in range(5):
                    start = time.time()
                    qres = g.query(query)
                    delta = time.time() - start

                    


if __name__ == '__main__':
    main()