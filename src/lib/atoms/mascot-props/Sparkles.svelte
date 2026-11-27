<script>
	const SPARK = 'M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0Z'
</script>

<svg class="spark one" viewBox="0 0 40 40" aria-hidden="true"><path d={SPARK} /></svg>
<svg class="spark two" viewBox="0 0 40 40" aria-hidden="true"><path d={SPARK} /></svg>
<svg class="spark three" viewBox="0 0 40 40" aria-hidden="true"><path d={SPARK} /></svg>

<style>
	.spark {
		position: absolute;
		fill: var(--mascot-color);
	}

	.one {
		inset-block-start: 4%;
		inset-inline-end: 2%;
		inline-size: 34px;
		block-size: 34px;
	}

	.two {
		inset-block-start: 30%;
		inset-inline-start: -4%;
		inline-size: 22px;
		block-size: 22px;
	}

	.three {
		inset-block-end: 8%;
		inset-inline-end: -6%;
		inline-size: 18px;
		block-size: 18px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.spark {
			animation: twinkle 1.2s ease-in-out infinite;
		}

		.two {
			animation-delay: 0.4s;
		}

		.three {
			animation-delay: 0.8s;
		}
	}

	@keyframes twinkle {
		0%,
		100% {
			transform: scale(0.4) rotate(0);
			opacity: 0.3;
		}
		50% {
			transform: scale(1) rotate(45deg);
			opacity: 1;
		}
	}
</style>
