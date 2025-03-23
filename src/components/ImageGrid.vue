<template>
  <section class="image-grid-wrapper" aria-label="취미 이미지 갤러리">
    <div
      v-if="isFetching && !isFetchingNextPage"
      class="loading-indicator"
      role="status"
      aria-live="polite"
    >
      로딩중...
    </div>
    <ul class="image-grid" v-if="files.length > 0" role="list">
      <li
        v-for="file in files"
        :key="file.id"
        class="image-grid-item"
        @click="handleClick(file)"
        @keydown.enter.prevent="handleClick(file)"
        @keydown.space.prevent="handleClick(file)"
        tabindex="0"
        role="button"
        :aria-label="`이미지: ${file.description || '설명 없음'}`"
      >
        <div class="image-container">
          <img
            :src="file.file_path"
            :alt="file.description || '업로드된 취미 이미지'"
            width="300"
            height="300"
            loading="lazy"
            class="grid-image"
          />
        </div>
        <p v-if="file.description" class="image-description">{{ file.description }}</p>
      </li>
    </ul>
    <div v-else>
      <p>현재 파일이 없습니다.</p>
    </div>
    <div ref="loadMoreRef" role="none"></div>
    <div v-if="isFetchingNextPage" class="loading-more" role="status" aria-live="polite">
      추가 데이터 로딩중...
    </div>
  </section>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { supabase } from '@/utils/supabase'

const PAGE_SIZE = 5

export default {
  props: {
    initialFiles: {
      type: Array,
      required: true,
    },
    onClick: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    const loadMoreRef = ref(null)
    const observer = ref(null)

    const fetchMediaFiles = async ({ pageParam = 0 }) => {
      const { data: files, error } = await supabase
        .from('files_upload')
        .select('*')
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
        .order('created_at', { ascending: false })

      if (error) throw error

      return files
        ? files.map((file) => ({
            ...file,
            created_at: new Date(file.created_at).toLocaleDateString('ko-KR'),
            updated_at: file.updated_at
              ? new Date(file.updated_at).toLocaleDateString('ko-KR')
              : null,
          }))
        : []
    }

    const {
      data: queryData,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
      status,
    } = useInfiniteQuery({
      queryKey: ['mediaFiles'],
      queryFn: fetchMediaFiles,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        Array.isArray(lastPage) && lastPage.length === PAGE_SIZE ? allPages.length : undefined,
      initialData: {
        pages: [props.initialFiles || []],
        pageParams: [0],
      },
    })

    const files = reactive([])

    watch(
      () => queryData.value?.pages,
      (newPages) => {
        if (newPages) {
          files.length = 0 // 기존 배열 초기화
          newPages.forEach((page) => {
            if (Array.isArray(page)) {
              files.push(...page)
            }
          })
        }
      },
      { immediate: true },
    )

    const handleObserver = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage()
      }
    }

    onMounted(() => {
      const element = loadMoreRef.value
      if (element) {
        observer.value = new IntersectionObserver(handleObserver, { threshold: 0.1 })
        observer.value.observe(element)
      }
    })

    const handleClick = (file) => {
      if (props.onClick) props.onClick(file)
    }

    return {
      loadMoreRef,
      files,
      isFetching,
      isFetchingNextPage,
      handleClick,
    }
  },
}
</script>

<style scoped>
.image-grid-wrapper {
  width: 100%;
  padding: 20px 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
}

.image-grid-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  background-color: #fff;
}

.image-grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.grid-image {
  object-fit: cover;
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
}

.image-description {
  padding: 10px;
  margin: 0;
  font-size: 14px;
  color: #333;
  border-top: 1px solid #eee;
  min-height: 40px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-indicator,
.loading-more {
  text-align: center;
  padding: 15px;
  font-size: 14px;
  color: #666;
}
</style>
