<template>
    <div>
        <div><router-link :to="{ path: '/test', query: { id: 'link跳转', name: 'vue' } }"> router-link跳转</router-link></div><br />
        <div @click="push('push跳转')">this.$router.push跳转</div><br>
        <div @click="replace('replace跳转')">this.$router.replace跳转</div><br>
        <div @click="resolve('resolve跳转')"> resolve跳转</div>
    </div>
</template>
<script>
export default {
    methods:{
        push:function(e){
        //    this.$router.push({path: '/test', query: {id: e}})
          this.$router.push({name: 'test', params: {id: e}})
           
        },
        replace:function(e){
        //    this.$router.replace({path: '/test', query: {id: e}})
           this.$router.replace({name: 'test', params: {id: e}})
        },
        resolve:function(e){
         const aa=this.$router.resolve({path: '/test', query: {id: e}})
        //    const aa=this.$router.resolve({name: 'test', params: {id: e}})
           window.open(aa.href,'_blank')
        }
    }
}
</script>
