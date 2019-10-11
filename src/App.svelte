<script>
  export let name;
  
  let red = true

  let data = "Loading ..."

  (async () => {
    try {
      let res = await fetch("https://baconipsum.com/api/?type=meat-and-filler", ["h1"])
      let json = await res.json()
      data = json[0]
    } catch(err) {
      data = "error: " + err
    }
  })()
</script>

<style>
	input {
		color: purple;
	}
</style>


<h1 class="bg-black text-red-200" class:bg-red-100={red} class:text-green-500={red}>Hi {name}!</h1>
<input bind:value={name} type="text" disabled={false}/>
<h2>{data}</h2>