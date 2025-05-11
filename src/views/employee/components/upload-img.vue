<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImg"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'

export default {
  name: 'UploadAvatar',
  props: {
    // 头像
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '' // 预览图片
    }
  },

  methods: {
    // 上传图片前触发，判断图片格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 自定义上传
    uploadImg(params) {
      console.log(process.env)

      if (params.file) {
        this.$message({
          message: '使用cos-sdk上传，由于流量问题，暂时禁用！',
          type: 'warning'
        })
        return
      }

      const cos = new COS({
        SecretId: '', // 存储桶的SecretId
        SecretKey: '' // 存储桶的 SecretKey
      })

      // 上传文件到腾讯云 COS
      cos.putObject({
        Bucket: '', // 存储桶名称
        Region: '', // 存储桶所在地区
        Key: params.file.name, // 存储桶中的文件名称
        StorageClass: 'STANDARD', // 存储类型，STANDARD 为标准存储
        Body: params.file // 上传的文件
      }, (err, data) => {
        // 上传成功后，获取文件的访问地址
        if (data.statusCode === 200 && data.Location) {
          // 拿到腾讯云返回的地址，通过input自定义事件将地址传出去
          this.$emit('input', 'http://' + data.Location)
        } else {
          this.$message.error(err.Message)
        }
      })
    }

  }
}

</script>

<style scoped lang="scss">
  // 样式穿透
  ::v-deep.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
