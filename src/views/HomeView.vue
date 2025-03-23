<script setup lang="ts">
defineOptions({
  name: 'HomeView',
})
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

interface Feature {
  id: number
  title: string
  description: string
  image_url: string
  image_alt: string
  image_credit: string
}

const features = ref<Feature[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const router = useRouter()
const featureRefs = ref<HTMLElement[]>([])

const fetchFeatures = async () => {
  loading.value = true
  try {
    const { data, error: supabaseError } = await supabase.from('features').select('*').order('id')

    if (supabaseError) throw supabaseError
    features.value = data
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeatures()

  // Intersection Observer 설정
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    },
  )

  // 모든 feature 요소에 observer 연결
  featureRefs.value.forEach((ref) => {
    if (ref) observer.observe(ref)
  })

  // 컴포넌트 언마운트시 observer 해제
  onUnmounted(() => {
    featureRefs.value.forEach((ref) => {
      if (ref) observer.unobserve(ref)
    })
  })
})

const featureItems = [
  {
    id: 1,
    image: '/images/전체게시물.png',
    alt: '취미 이미지 공유 기능 화면 예시',
    title: '취미 이미지 공유',
    description: '나만의 취미 활동을 이미지로 기록하고 다른 사람들과 공유해보세요.',
    detail:
      '당신의 취미 활동을 사진으로 기록하고, 다른 사람들과 함께 나눠보세요. 취미 커뮤니티에서 새로운 아이디어를 얻거나 영감을 받을 수 있습니다.',
  },
  {
    id: 2,
    image: '/images/올린글.png',
    alt: '개인 갤러리',
    title: '개인 갤러리',
    description: '내가 올린 이미지를 한 곳에서 모아볼 수 있습니다.',
    detail:
      '시간 순으로 정리된 나만의 갤러리에서 취미 활동의 발전 과정을 확인해보세요. 과거의 작품들을 돌아보며 성장을 느낄 수 있습니다.',
  },
  {
    id: 3,
    image: '/images/업로드.png',
    alt: '이미지 업로드',
    title: '이미지 업로드',
    description: '자신의 취미 작품을 쉽고 빠르게 업로드할 수 있습니다.',
    detail:
      '원하는 사진을 선택하고 제목과 설명을 추가하여 나만의 작품을 공유해보세요. 간편한 업로드 기능으로 언제든지 당신의 취미 활동을 기록할 수 있습니다.',
  },
  {
    id: 4,
    image: '/images/수정.png',
    alt: '게시물 수정',
    title: '게시물 수정',
    description: '업로드한 게시물의 내용을 언제든지 수정할 수 있습니다.',
    detail:
      '내용이나 제목에 변경이 필요할 때 간편하게 수정할 수 있어요. 더 정확한 정보나 추가 설명이 필요할 때 게시물을 업데이트해보세요.',
  },
  {
    id: 5,
    image: '/images/삭제.png',
    alt: '게시물 삭제',
    title: '게시물 삭제',
    description: '더 이상 필요하지 않은 게시물을 쉽게 삭제할 수 있습니다.',
    detail:
      '삭제 기능을 통해 갤러리를 정리하고 원하는 콘텐츠만 유지할 수 있어요. 실수로 올린 게시물이나 오래된 작품을 간편하게 관리하세요.',
  },
]
</script>

<template>
  <article class="introduce-layout">
    <!-- 히어로 섹션 -->
    <section class="hero-section-layout">
      <div class="hero-section">
        <h1>Hobby Hive<br />취미 공유 커뮤니티</h1>
        <p>다양한 취미를 공유하고 다른 사람들의 취미를 구경해보세요!</p>
        <div class="button-wrapper">
          <button class="start-button" @click="router.push('/all')">시작하기</button>
        </div>
      </div>
      <div class="hero-image" v-if="features.length > 0">
        <img :src="features[0].image_url" :alt="features[0].image_alt" class="main-image" />
      </div>
    </section>

    <!-- 주요 기능 소개 -->
    <section v-if="!loading && !error" class="feature-section">
      <h2>주요 기능</h2>
      <div class="features-container">
        <div
          v-for="(item, index) in featureItems"
          :key="item.id"
          class="feature-item"
          :class="{ reverse: index % 2 !== 0, visible: true }"
          :ref="
            (el) => {
              if (el) featureRefs[index] = el
            }
          "
        >
          <div class="feature-image-container">
            <img :src="item.image" :alt="item.alt" class="feature-image" />
          </div>
          <div class="feature-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.detail }}</p>
          </div>
        </div>
      </div>
    </section>

    <div v-if="error" class="error-message">데이터를 불러오는데 실패했습니다.</div>
    <div v-if="!loading && features.length === 0" class="empty-message">데이터가 없습니다.</div>
  </article>
</template>

<style lang="scss" scoped>
@use 'sass:map';

// 색상 변수 추가
$colors: (
  'text-primary': #111111,
  'text-secondary': #666666,
  'bg-primary': #ffffff,
  'border-light': #e5e7eb,
);

.introduce-layout {
  display: flex;
  flex-direction: column;
  gap: 12rem;
  padding: 8rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
    gap: 6rem;
  }
}

.hero-section-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

.hero-section {
  flex: 1;

  h1 {
    font-size: clamp(3rem, 5vw, 5rem);
    line-height: 1.2;
    margin-bottom: 2rem;
    font-weight: 700;
    color: map.get($colors, 'text-primary');
  }

  p {
    font-size: clamp(1.6rem, 2vw, 2rem);
    margin-bottom: 3rem;
    line-height: 1.6;
    color: map.get($colors, 'text-secondary');
  }
}

.button-wrapper {
  .start-button {
    font-size: 1.8rem;
    padding: 1.2rem 3rem;
    border-radius: 8px;
    background-color: #1677ff;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #4096ff;
      transform: translateY(-2px);
    }
  }
}

.feature-section {
  h2 {
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    text-align: center;
    margin-bottom: 6rem;
  }
}

.features-container {
  display: flex;
  flex-direction: column;
  gap: 12rem;

  @media (max-width: 768px) {
    gap: 6rem;
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 6rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &.reverse {
    flex-direction: row-reverse;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 3rem;

    &.reverse {
      flex-direction: column;
    }
  }
}

.feature-image-container {
  flex: 1;
  max-width: 500px;
  margin: 0 auto;

  .feature-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
}

.feature-content {
  flex: 1;

  h3 {
    font-size: clamp(2rem, 3vw, 2.8rem);
    margin-bottom: 2rem;
    color: map.get($colors, 'text-primary');
  }

  p {
    font-size: clamp(1.4rem, 2vw, 1.8rem);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    color: map.get($colors, 'text-secondary');

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: 1024px) {
    text-align: center;
  }
}

.error-message,
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.8rem;
}
</style>
