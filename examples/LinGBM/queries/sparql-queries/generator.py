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
            for index in range(len(config[query][size])):
                print(config[query][size][index])
                translated_query = re.sub("%.*%", str(config[query][size][index]), content)
                f = open("./" + size + "/" + query + "/" + str(config[query][size][index]) + ".rq","w+")
                f.write(translated_query)
                f.close()


if __name__ == '__main__':
    main()
