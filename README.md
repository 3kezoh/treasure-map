# Treasure map

## Description

This project aims to simulate the exploration of a map by adventurers. It reads an input file containing map details and adventurer movements, simulates these movements, tracks treasure collection and generates an output file with the final results.

## Features

Input File Reading: The program reads a file that describes a map with mountains, treasures, and adventurers. It ignores lines starting with '#'.

Sequential Movement: Adventurers take turns moving one step at a time in four directions (north, west, south, east). They avoid overlapping, stay within the map, and collect treasures.

Treasure Tracking: The program keeps track of the treasures adventurers collect.

Output File: It creates an output file that shows the final map state, including remaining treasures, collected treasures, and adventurer positions.

## Requirements

To run this project, you'll need the following software and dependencies:

Node.js: This project is built using Node.js. You'll need Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/en/download).

NPM or PNPM: These are used to manage project dependencies. NPM comes bundled with Node.js, but you can also use PNPM, which can be installed globally by running npm install -g pnpm.

## Installation

```sh
# Clone the repository
git clone https://github.com/3kezoh/treasure-map.git

# Change to the project directory
cd treasure-map

# Install dependencies
pnpm install
```

## Usage

In the root of the project, using the existing treasure-map.txt file.

```
# Using ts-node
pnpx ts-node src ./treasure-map.txt result.txt

# Using node
pnpm build
node dist ./treasure-map.txt result.txt

# Using docker
docker run --rm -v $(pwd)/data:/home/node/treasure-map/data ekezoh/treasure-map ./data/treasure-map.txt ./data/result.txt
```
