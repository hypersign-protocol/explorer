<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}

.selectedButton{
  border-bottom: 1px solid #8080809e;
  font-weight: bold;
}

.nav-style{
  background: #FFFFFF;
  margin-bottom: 1%;
  padding:5px;
  padding-left:1.5%;
  text-align: left;
  box-shadow:
         rgba(0, 0, 0, 0.1) 0px 2px 2px 0px, 
            rgba(0, 0, 0, 0.02) 0px 3px 1px -2px, 
            rgba(0, 0, 0, 0.01) 0px 1px 5px 0px;
}

.rightAlign{
  text-align: end;
}

.card-radius{
  border-radius: 10px;
}


.logo-style {
    width: 144px;
    /* height: 40px; */
    margin-top: 9px;
    margin-left: 5px;
}

#app {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background: #F6F6F687;
}

.subtitle{
  padding-left: 10px;
  color: gray;
  font-size: larger;
  margin-top: auto;
}


</style>
<template>
  <div id="app">
    <div class="row nav-style">
      <div class="col-md-4">        
        <!-- <h5 class="leftAlign">{{$config.app.name}}</h5>  -->
        <div class="form-group form-inline">
          <img class="logo-style" src="https://thumb.tildacdn.com/tild3065-3765-4865-b331-393637653931/-/resize/150x/-/format/webp/hypersign_Yellow.png"> 
          <h4 class="subtitle"> <span style="opacity:0.4">|</span> {{$config.app.name}} ({{$config.app.version}})</h4>  
        </div>
      </div>
        <div class="col-md-8 rightAlign" style="padding-top:12px">
          <!-- <div > -->
            <button type="button" @click="goToNextPage(m.name)" class="btn btn-light btn-sm" v-for="m in menu" :key="m.name">{{m.name}}</button>    
          <!-- </div> -->
        </div>
        
        <!-- <h6
          class="leftAlign"
          style="color:grey; font-style: italic;"
        >{{$config.app.decription}}</h6> -->
        <!-- <h6 class="leftAlign" style="color:grey; font-style: italic;">Version: {{$config.app.version}}</h6> -->
        <!-- <hr style="opacity: 1.5" /> -->
      
    </div>
    <!-- <div class="row">
      <div class="col-md-9 rightAlign marginLeft" v-if="!(authRoutes.includes($router.history.current.name))">
        <button @click="goToNextPage(m.name)" class="btn btn-link btn-sm" v-for="m in menu" :key="m.name">{{m.name}}</button>
        <hr style="opacity: 1.5" />
      </div>
    </div> -->
    <router-view />
    <notifications group="foo" />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.centeralign {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

<script>
export default {
  name: 'app',
  data(){
    return {
      menu: [
        { 
          name: "Dashboard",  
          path: "/explorer/",
          isShow: true,
        },
        { 
          name: "Get DID",  
          path: "/explorer/newdid",
          isShow: true,
        },
        { 
          name: "Studio",  
          isShow: true,
        }
      ]
    }
  },
  methods: {
    goToNextPage(route){
      const r = this.menu.find(x => x.name === route)
      if(r.name === "Studio") {
        window.location.href = this.$config.studio.BASE_URL + "login"
      }
      this.$router.push(r.path)
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push(r.path)
                }
    }
  }
}
</script>


