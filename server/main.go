package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"gopkg.in/olebedev/go-duktape.v3"
)

var (
	ctx *duktape.Context
	fs  http.Handler

	polyfill []byte
	js       []byte
	html     []byte
)

func main() {

	polyfill, _ = ioutil.ReadFile("../dist/polyfill.js")
	js, _ = ioutil.ReadFile("../dist/ssr.js")
	html, _ = ioutil.ReadFile("../public/index.html")

	ctx = duktape.New()
	if err := ctx.PevalString(string(polyfill)); err != nil {
		panic(err)
	}
	if err := ctx.PevalString(string(js)); err != nil {
		panic(err)
	}

	fs = http.FileServer(http.Dir("../public/"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", render)

	http.ListenAndServe("localhost:8800", nil)
}

func render(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	defer func() {
		fmt.Printf("took %v\n", time.Since(start))
		if r := recover(); r != nil {
			fmt.Fprintf(w, "%v", r)
		}
	}()

	ctx.GetGlobalString("render")

	i := ctx.PushObject()

	if r.URL.Path != "" {
		ctx.PushString(r.URL.Path[1:])
		ctx.PutPropString(i, "name")
	}

	ctx.Call(1)

	result := []byte(ctx.GetString(-1))

	ctx.Pop()

	out := bytes.Replace(html, []byte("_SSR_"), result, 1)

	w.Write(out)
}
