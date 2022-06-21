<template>
  <div class="coinports">
    <div class="title has-text-centered">
      CoinPorts
    </div>
    <h4 class="has-text-centered mb-5">The only Crypto Portfolio Manager you need!</h4>
    <form
      @submit.prevent="addCoin"
    >
      <div class="field is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model="newCoinContent" 
            class="input" 
            type="text" 
            placeholder="Add a coin / price / amount / date"
          >
        </p>
        <p class="control">
          <button
            :disabled="!newCoinContent" 
            class="button is-info"
          >
            Add
          </button>
        </p>
      </div>
    </form>
    <div
      v-for="coin in coins" 
      class="card mb-5"
      :class="{ 'has-background-success-light' : coin.done }"
    >
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div 
              class="column"
              :class="{ 'has-text-success line-through' : coin.done }"
            >
              {{ coin.content }}
            </div>
            <div class="column is-5 has-text-right">
              <button
                @click="toggleDone(coin.id)" 
                class="button"
                :class="coin.done ? 'is-success' : 'is-light'"
              >
                &check;
              </button>
              <button
                @click="deleteCoin(coin.id)" 
                class="button is-danger ml-2"
              >
                &cross;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // IMPORTS
  import { ref, onMounted } from 'vue'
  import { 
    collection, onSnapshot, 
    addDoc, deleteDoc, doc, updateDoc,
    query, orderBy
  } from "firebase/firestore"
  import { db } from '@/firebase'
  // FIREBASE REFS
  const coinsCollectionRef = collection(db, "coins")
  const coinsCollectionQuery = query(coinsCollectionRef, orderBy("date", "desc"))
  // COINS
  const coins = ref([])
  // GET COIN
  onMounted(() => {
    onSnapshot(coinsCollectionQuery, (querySnapshot) => {
      const fbCoins = [];
      querySnapshot.forEach((doc) => {
        const coin = {
          id: doc.id,
          content: doc.data().content,
          done: doc.data().done
        }
        fbCoins.push(coin)
      });
      coins.value = fbCoins
    });
  })
  // ADD COIN
  const newCoinContent = ref('')
  const addCoin = () => {
    addDoc(coinsCollectionRef, {
      content: newCoinContent.value,
      done: false,
      date: Date.now()
    });
    newCoinContent.value = ''
  }
  // DELETE COIN
  const deleteCoin = (id) => {
    deleteDoc(doc(coinsCollectionRef, id))
  }
  // TOGGLE DONE
  const toggleDone = (id) => {
    const index = coins.value.findIndex(coin => coin.id === id)
    updateDoc(doc(coinsCollectionRef, id), {
      done: !coins.value[index].done
    });
  }
</script>

<style>
  @import 'bulma/css/bulma.min.css';
  @import '/src/App.css';
  .coinports {
    max-width: 1000px;
    padding: 20px;
    margin: 0 auto;
  }
  .line-through {
    text-decoration: line-through;
  }
</style>