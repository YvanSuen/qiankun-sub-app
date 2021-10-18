<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="content">
          <router-view></router-view>
        </div>
        
    </div>
</template>

<script>
import vHead from './Header.vue';
export default {
      data() {
        return {
            tagsList: []
        };
    },
    components: {
        vHead
    },
    methods: {
      
    }
};
</script>
