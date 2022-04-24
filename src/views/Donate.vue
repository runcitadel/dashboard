<template>
  <div>
    <div class="p-sm-2">
      <div class="my-3">
        <div>
          <h1>donate</h1>
          <p>Help us continue to build Citadel</p>
        </div>
      </div>
    </div>
    <card-widget header="We can't offer Citadel without your support">
      <div class="px-3 px-lg-4 pb-3">
        Thank you for using Citadel! As you probably know, we're a completely
        free (as in free speech) open source project.<br />
        To make it possible for us to spend more time on Citadel, build more
        features and to make it better, we need your support.<br />
        Your support also helps us to continue offering other services to you
        for free, like <a href="https://sats4.me">sats4.me</a> and automated
        backups of your Lightning channels.<br />
        <br />
        If you want to support us, please consider sending us some sats
        <a href="https://c.lnbits.rocks/tipjar/1">here</a>.
      </div>
    </card-widget>
  </div>
</template>

<script lang="ts" setup>
import CardWidget from '../components/CardWidget.vue';
</script>
