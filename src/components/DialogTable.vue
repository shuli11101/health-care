<!-- 新增/编辑弹窗 -->
 <script setup>
  import { ref, computed, reactive, nextTick, watch } from 'vue'
  import { defineProps, defineEmits } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { uploadCover, createArticle, updateArticle } from '@/api/admin'
  import { ElMessage } from 'element-plus'
  import { fileBaseUrl } from '@/config/index'
  import RichTextEditor from '@/components/RichTextEditor.vue'

  // 弹窗是否显示
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array
    },
    currentArticle: {
      type: Object,
      default: null
    },
  })

  const emit = defineEmits(['update:modelValue', 'create'])
  // 处理弹窗显示状态改变事件
  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => {
      emit('update:modelValue', val)
    }
  })

  // 表单数据
  const formData = ref({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": '',
    "summary": "",
    "tags": [],
    "id": ""
  })

  // 表单校验规则
  const formRef = ref(null)
    const rule = reactive({
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    categoryId: [
      { required: true, message: '请选择分类', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请输入文章内容', trigger: 'blur' },
      {max: 5000, message: '文章内容不能超过5000个字符', trigger: 'blur'}
    ]

  })

  // 文章标签
  const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

  // 上传图片
  const imageUrl = ref('')
  const beforeAvatarUpload = (file) => {
    const isImg = file.type.startsWith('image/')
    if(!isImg) {
      ElMessage.error('请上传图片')
      return false
    }
    if(file.size > 1024 * 1024 * 2) {
      ElMessage.error('图片大小不能超过2MB')
      return false
    }
    return isImg
  }

  const businessId = ref(null)
  const handleAvatarRequest = async ({ file }) => {
      // 生成唯一标识
     businessId.value = crypto.randomUUID()

      const res = await uploadCover(file, {
        businessId: businessId.value
      })

      console.log(res)


      // 拼接文件接口
      imageUrl.value = fileBaseUrl + res.data.filePath
      // 传给后端的地址(只接收相对路径就好)
      formData.value.coverImage = res.data.filePath
  }

  // 移除封面
  const clearCover = () => {
    imageUrl.value = ''
    formData.value.coverImage = ''
  }

  // 富文本编辑
  const handleContentChange = (data) => {
    console.log(data)
    formData.value.content = data.html
  }
  // 创建完成后
  const editorInstance = ref(null)  //富文本默认值
  const handleEditorCreated = (editor) => {
    editorInstance.value = editor
    if(formData.value.content && editor) {
      nextTick(() => {
        editor.setHtml(formData.value.content)
      })
    }
  }

  // 预览按钮切换
  const preview = ref(false)

  // 提交按钮
  const isEdit = computed(() => !!props.currentArticle)
  const loading = ref(false)
  const handleCreate = async () => {
    console.log(formData.value)
    try {
      await formRef.value.validate()
      loading.value = true
      console.log(formData.value)
      const submitData = {
        ...formData.value,
        tags: formData.value.tags
      }
      if(!isEdit.value) {
        await createArticle(submitData)
        ElMessage.success('新增成功')
      } else{
        await updateArticle(formData.value.id, submitData)
        ElMessage.success('编辑成功')
      }
      emit('create')
      dialogVisible.value = false
      formData.value = {
        "title": "",
        "content": "",
        "coverImage": "",
        "categoryId": '',
        "summary": "",
        "tags": [],
        "id": ""
      }
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  // 监听编辑数据
  watch(() => props.currentArticle, (newVal) => {
    console.log('newVal', newVal)
    nextTick(() => {
      if(newVal) {
      Object.assign(formData.value, newVal)
      formData.value.tags = newVal.tagArray
      // 封面Url
      console.log('newVal.coverImage', newVal.coverImage)
      imageUrl.value = fileBaseUrl + newVal.coverImage
      businessId.value = newVal.coverImage

    }
    })
  })

  // 关闭弹窗
  const handleClose = () => {
    formRef.value.resetFields()
    clearCover()
    imageUrl.value = ''
    businessId.value = null
    emit('update:modelValue', false)
  }

</script>
<template>
  <el-dialog 
  :title="isEdit ? '编辑文章' : '新增文章'" 
  v-model="dialogVisible"
  width="50%"
  class="dialog-container"
  @close="handleClose">
  <el-form :model="formData" :rules="rule" ref="formRef">
    <el-form-item label="标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入标题" clearable maxlength="20" show-word-limit style="width: 100%" />
    </el-form-item>
    <el-form-item label="分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择分类" clearable maxlength="20" show-word-limit>
        <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="Number(item.value)" />
      </el-select>
    </el-form-item>
    <el-form-item label="摘要" prop="summary" style="margin-left: 10px;">
      <el-input type="textarea" v-model="formData.summary" placeholder="请输入摘要(可选)" maxlength="1000" show-word-limit :rows="4" style="width: 100%" />
    </el-form-item>
    <el-form-item label="文章标签" prop="tags">
      <el-select v-model="formData.tags" placeholder="请输入标签(可选)" multiple filterable allow-create style="width: 100%" >
        <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
      </el-select>
    </el-form-item>
    <el-form-item label="封面图片">
      <div class="cover-upload">
        <el-upload 
        class="avatar-uploader" 
        :show-file-list="false" 
        :http-request="handleAvatarRequest"
        :before-upload="beforeAvatarUpload"
        accept="image/*">
        <img v-if="imageUrl" :src="imageUrl" class="cover-image" />
        <div v-else class="cover-placeholder">
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        </div>
      </el-upload>
      <el-button v-if="imageUrl" type="danger" @click="clearCover">移除封面</el-button>
      </div>
    </el-form-item>
    <el-form-item prop="content">
      <RichTextEditor
        v-model="formData.content"
        placeholder="请输入文章内容"
        :maxCharCount="5000"
        @created="handleEditorCreated"
        @change="handleContentChange"
        min-height="400px"
      >

      </RichTextEditor>
    </el-form-item>
  </el-form>
  <div v-if="preview">
    <p>内容预览：</p>
    <div v-html="formData.content"></div>
  </div>
  <template #footer>
    <el-button @click="preview = !preview">{{ preview ? '取消预览' : '预览' }}</el-button>
    <el-button @click="handleCreate" type="primary" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>

    <el-button @click="handleClose">取消</el-button>
  </template>

  </el-dialog>
</template>

<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background-color: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>