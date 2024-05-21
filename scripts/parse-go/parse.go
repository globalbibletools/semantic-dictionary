package main

import (
	"encoding/xml"
	"fmt"
	"os"
)

type Data struct {
	Lexicon Lexicon `xml:"Lexicon"`
}
type Lexicon struct {
	XMLName        xml.Name        `xml:"Lexicon"`
	LexiconEntries []Lexicon_Entry `xml:"Lexicon_Entry"`
}

type Lexicon_Entry struct {
}

func main() {
	args := os.Args
	if len(args) < 2 {
		fmt.Println("Error: please provide a path to a downloaded UBS Dictionary file.")
		return
	} else if len(args) < 3 {
		fmt.Println("Error: please provide a language code")
		return
	}

	path := args[1]
	xmlFile, err := os.Open(path)

	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	defer xmlFile.Close()

	language := args[2]

	var languageFolder = "../../data/" + language

	e := os.MkdirAll(languageFolder, os.ModeDir)

	if e == nil {
		fmt.Println("Okay, it went okay")
	} else {
		fmt.Println("Face palm ", e)
		return
	}

	var xmlBytes []byte
	xmlFile.Read(xmlBytes)

	var structuredData Data

	fmt.Println("Parsing dicitonary...")
	xml.Unmarshal(xmlBytes, &structuredData)
	fmt.Println(structuredData.Lexicon.LexiconEntries[0])
	fmt.Println("Finished parsing.")

	fmt.Println("Splitting into files...")

	fmt.Println("Finished splitting.")
}
