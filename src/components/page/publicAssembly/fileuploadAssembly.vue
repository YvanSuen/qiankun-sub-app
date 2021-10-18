<template>
    <div>
        <el-upload
            class="upload-demo"
            :action="url"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadFail"
            :file-list="fileList"
        >
            <el-button size="small" type="primary" style="float:left;">点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            fileList: [],
            url:BaseWebApiUrl+'/Public/Post/'
        };
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.childMethodDel();
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        fileUploadFail: function (response, file, fileList) {
            this.$message.warning(`文件上传失败${response.message}`);
        },
        //文件上传服务端成功时的钩子
        fileUploadSuccess: function (response, file, fileList) {
             this.$message.success(`文件上传成功`);
            this.childMethod(file);
            //清空已上传的文件列表 
             
            
        },
        childMethod(file) {
              this.$emit('fatherMethodFileupLoad',file.response.newFileName, file.name);
         
         },
        childMethodDel() {
              this.$emit('fatherMethodFileupLoadDel');
          
      }, ClearInput(){

           this.fileList= [];
      }
      , SetInput(AttUrl,AttName){
          if (AttUrl!=""&& AttName!="")   
             this.fileList.push({
                                name: AttName,
                                url:AttUrl,
           });
           
      }
      
      
    }
};
</script>

<style lang="scss" scoped>
</style>