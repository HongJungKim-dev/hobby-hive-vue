<template>
  <footer class="site-footer" role="contentinfo" aria-label="사이트 정보">
    <div class="footer-content">
      <!-- Hobby Hive 소개 섹션 -->
      <div class="footer-section">
        <h2 id="footer-heading-about">Hobby Hive</h2>
        <p>다양한 취미를 공유하는 커뮤니티입니다.</p>
      </div>

      <!-- 사이트 링크 섹션 -->
      <div class="footer-section">
        <h2 id="footer-heading-links">사이트 링크</h2>
        <nav aria-labelledby="footer-heading-links">
          <ul>
            <li>
              <router-link to="/" aria-label="홈 페이지로 이동">홈</router-link>
            </li>
            <li>
              <router-link to="/" aria-label="서비스 소개 페이지로 이동">서비스 소개</router-link>
            </li>
            <li>
              <router-link to="/all" aria-label="모든 게시물 둘러보기">둘러보기</router-link>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 문의하기 섹션 -->
      <div class="footer-section">
        <h2 id="footer-heading-contact">문의하기</h2>
        <address>
          <p>
            이메일:
            <a href="mailto:contact@hobbyhive.com" aria-label="이메일로 문의하기">
              contact@hobbyhive.com
            </a>
          </p>
        </address>
      </div>
    </div>

    <!-- 하단 정보 -->
    <div class="footer-bottom">
      <p>
        <small>&copy; {{ new Date().getFullYear() }} Hobby Hive. All rights reserved.</small>
      </p>
    </div>
  </footer>
</template>

<script setup>
// Vue에서는 별도의 로직이 필요하지 않습니다. 템플릿과 스타일이 중심이 됩니다.
</script>

<style scoped>
.site-footer {
  background-color: #f8f8f8;
  padding: 20px;
  font-size: 14px;
  color: #333;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.footer-section p {
  margin: 0;
  font-size: 0.9rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin: 5px 0;
}

.footer-section ul li a {
  text-decoration: none;
  color: #007bff;
}

.footer-section ul li a:hover {
  text-decoration: underline;
}

.footer-bottom {
  text-align: center;
  font-size: 0.8rem;
  margin-top: 20px;
  color: #999;
}
</style>
