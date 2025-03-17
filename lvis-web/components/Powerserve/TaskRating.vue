<template>
    <div class="task-rating-card">
      <div class="card">
        <div class="card-body d-flex align-items-center justify-content-center">
          <!-- Trophy Image -->
          <img src="/img/trophy.png" alt="Trophy" class="trophy-img me-3" />
  
          <div>
            <!-- Card Title -->
            <h5 class="card-title">This is your rating 10/10</h5>
  
            <!-- Star Rating -->
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(score) }">
                ★
              </span>
            </div>
  
            <!-- Rating Level -->
            <div class="rating-level">{{ ratingLevel }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  });
  
  // Compute rating level
  const ratingLevel = computed(() => {
    if (props.score >= 4.5) return "🎉 Excellent";
    if (props.score >= 3.5) return "💪 Good";
    if (props.score >= 2.5) return "😉 Average";
    if (props.score >= 1.5) return "⚠️ Below Average";
    return "❌ Poor";
  });
  </script>
  
  <style scoped>
  /* Full-Width Container */
  .task-rating-card {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  /* Card Styling */
  .card {
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border: none;
  }
  
  /* Centered Content */
  .card-body {
    display: flex;
    align-items: center;
    text-align: left;
  }
  
  /* Trophy Image */
  .trophy-img {
    width: 70px;
    height: auto;
  }
  
  /* Score Styling */
  .score {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }
  
  /* Star Rating */
  .stars {
    font-size: 1.8rem;
  }
  
  .star {
    color: #ccc;
    transition: color 0.3s ease-in-out;
  }
  
  .star.filled {
    color: gold;
  }
  
  /* Rating Level */
  .rating-level {
    font-size: 1rem;
    font-weight: bold;
    color: #555;
    margin-top: 5px;
  }

  .trophy-img {
    width: 120px; /* Increase the width */
    height: auto;
    }
  </style>
  