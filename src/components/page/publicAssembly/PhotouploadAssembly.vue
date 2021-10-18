/*上传单个图片 */
<template>
    <div>
        <el-upload
          action="https://localhost:44311/Public/UploadFile/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="fileUploadSuccess"
          :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :class="{'demo-httpRequestImg':httpRequestImg}">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        httpRequestImg:false,//展示单个图片
      };
    },
    methods: {
      //文件上传服务端成功时的钩子
        fileUploadSuccess: function (response, file, fileList) {
            this.httpRequestImg = true;
            this.$message.success(`文件上传成功`);
            this.$emit('fileupLoad',file.response.newFileName, file.name);
        },
      handleRemove(file, fileList) {
        this.httpRequestImg = false;
        this.$emit('filedelete');
      },
      beforeAvatarUpload(file) {
        const isJPG =
            file.type === "image/jpeg" ||
            file.type === "image/JPEG" ||
            file.type === "image/jpg" ||
            file.type === "image/JPG" ||
            file.type === "image/png" ||
            file.type === "image/PNG" ||
            file.type === "image/bpm" ||
            file.type === "image/BPM";

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是jpg / png / bpm格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }

        return isJPG && isLt2M;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //清空list
      ClearList(){
        this.fileList= [];
        this.httpRequestImg = false;
      },
      //回显图片
      handleShowImg(AttUrl,AttName)
      {
        if (AttUrl!=""&& AttName!=""){
          this.fileList.push({
            name: AttName,
            url:AttUrl,
          });
        }

        this.httpRequestImg = true;
      }
    }
  }
</script>

<style>
  .demo-httpRequestImg /deep/.el-upload--picture-card{
        display: none;
    }
</style>

