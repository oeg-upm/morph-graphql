#!/bin/python
import argparse
import re
import json
import os


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--json_config", required=True, help="Input config file with yarrrml and csvw")
    args = parser.parse_args()
    with open(args.json_config, "r") as json_file:
        config = json.load(json_file)

    for query in config:
        
        for size in config[query]:
            with open("./" + query + ".rq", "r") as file:
                content = file.read()
            os.system("mkdir ./" + size)
            os.system("mkdir ./" + size + "/" + query)
            for index in config[query][size]:
                translated_query = re.sub("%.*%", index, content)
                f = open("./" + size + "/" + query + "/" + index + ".rq")
                f.write(translated_query)
                f.close()


if __name__ == '__main__':
    main()
