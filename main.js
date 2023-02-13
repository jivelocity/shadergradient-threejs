import * as THREE from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import './style.css'

import _vite_plugin_require_transform_case1 from 'nice-color-palettes'

var colors = _vite_plugin_require_transform_case1
// var colors = require('nice-color-palettes')
console.log(colors)

let indexColor = Math.floor(Math.random() * colors.length)

indexColor = { id: 10 }
let palette = colors[indexColor.id]
palette = palette.map((color) => new THREE.Color(`${color}`))

export default class Sketch {
	constructor(options) {
		this.container = options.domElement
		this.width = this.container.offsetWidth
		this.height = this.container.offsetHeight

		// Camera
		this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.01, 1000)
		this.camera.position.z = 0.2

		this.scene = new THREE.Scene()

		// Render
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		this.container.appendChild(this.renderer.domElement)
		// this.controls = new OrbitControls(this.camera, this.renderer.domElement)

		this.time = 0
		this.resize()
		this.addObjects()
		this.addLights()
		this.render()

		this.setupResize()
	}

	resize() {
		this.width = this.container.offsetWidth
		this.height = this.container.offsetHeight
		this.renderer.setSize(this.width, this.height)
		this.camera.aspect = this.width / this.height
		this.camera.updateProjectionMatrix()
	}

	setupResize() {
		window.addEventListener('resize', this.resize.bind(this))
	}

	// Object
	addObjects() {
		// this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)

		this.geometry = new THREE.PlaneGeometry(1.5, 1.5, 150, 150)
		// this.material = new THREE.MeshNormalMaterial()

		this.material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 1.0 },
				uColor: { value: palette },
				resolution: { value: new THREE.Vector4() },
			},
			vertexShader: vertex,
			fragmentShader: fragment,
			// wireframe: true,
		})

		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.scene.add(this.mesh)
	}

	addLights() {
		const light1 = new THREE.AmbientLight(0xffffff, 0.5)
		this.scene.add(light1)

		const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
		light2.position.set(0.5, 0, 0.866)
		this.scene.add(light2)
	}

	//Render Animation

	render() {
		this.time += 0.0003
		this.material.uniforms.time.value = this.time
		this.mesh.rotation.x = this.time / 2000
		this.mesh.rotation.y = this.time / 1000

		this.renderer.render(this.scene, this.camera)
		window.requestAnimationFrame(this.render.bind(this))
	}
}

new Sketch({
	domElement: document.getElementById('container'),
})
