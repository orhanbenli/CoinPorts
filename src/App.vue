<template>
  <div class="coinports">

    <div class="title has-text-centered">
      CoinPorts
    </div>

    <form
      @submit.prevent="addCoin"
    >
      <div class="field is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model="newCoinContent" 
            class="input" 
            type="text" 
            placeholder="Add a coin"
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

  // imports

  import { ref, onMounted } from 'vue'
  import { collection, onSnapshot, addDoc } from "firebase/firestore"
  import { db } from '@/firebase'

  // firebase refs
  const coinsCollectionRef = collection(db, "coins")

  // coins

  const coins = ref([
    // {
    //   id: 'id1',
    //   content: 'Bitcoin (BTC)',
    //   done: false
    // },
    // {
    //   id: 'id2',
    //   content: 'Ethereum (ETH)',
    //   done: true
    // }
  ])

  // get coin
  
  onMounted(() => {
    onSnapshot(coinsCollectionRef, (querySnapshot) => {
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

  // add coin

  const newCoinContent = ref('')

  const addCoin = () => {
    addDoc(coinsCollectionRef, {
      content: newCoinContent.value,
      done: false
    });
    newCoinContent.value = ''
  }

  // delete coin

  const deleteCoin = (id) => {
    coins.value = coins.value.filter(coin => coin.id !== id )
  }

  // toggle done

  const toggleDone = (id) => {
    const index = coins.value.findIndex(coin => coin.id === id)
    coins.value[index].done = !coins.value[index].done
  }

</script>

<style>
  @import 'bulma/css/bulma.min.css';
  .coinports {
    max-width: 400px;
    padding: 20px;
    margin: 0 auto;
  }

  .line-through {
    text-decoration: line-through;
  }
</style>