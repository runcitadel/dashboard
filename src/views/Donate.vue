<template>
  <div class="p-sm-2">
    <div class="my-3 pb-3">
      <div class="d-flex justify-content-between align-items-center">
        <h1>Donate</h1>
        <p>Do you like Citadel so far?</p>
        <p>
          We're building Citadel for free and rely on donations to continue
          development. If you like Citadel and want to support us, please
          consider donating.
        </p>
        <h3>Bitcoin</h3>
        <p>You can donate to our Bitcoin address:</p>
        <input-copy value="Example address" class="mb-4 mt-1" />
        <h3>Lightning</h3>
        <p>You can donate in Lightning over Zebedee:</p>
        <a href="zbd.gg/aarondewes">Our Zebedee account</a>
      </div>
    </div>
  </div>
</template>

<script>
import InputCopy from "@/components/Utility/InputCopy";

export default {
  components: {
    InputCopy,
  },
};
</script>
