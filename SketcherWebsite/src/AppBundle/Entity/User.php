<?php

namespace AppBundle\Entity;


use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\ArrayCollection;
use AppBundle\Entity\Sketch;


/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 * @UniqueEntity(fields="email", message="Email {{ value }} already in use")
 * @UniqueEntity(fields="username", message="Username {{ value }} is already taken")
 */
class User implements UserInterface, \Serializable
{
	private $salt;

	/**
	 * @ORM\Column(type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;

	/**
	 * @ORM\Column(type="string", length=25, unique=true)
	 * @Assert\NotBlank()
	 */
	private $username;

	/**
		* @Assert\NotBlank()
		* @Assert\Length(max=4096)
		*/
	private $plainPassword;

	/**
	 * @ORM\Column(type="string", length=64)
	 */
	private $password;

	/**
	 * @ORM\Column(type="string", length=60, unique=true)
	 * @Assert\NotBlank()
     * @Assert\Email()
	 */
	private $email;

	/**
	 * @ORM\Column(type="string", length=5)
	 * @Assert\NotBlank()
     * @Assert\Locale()
	 */
	private $locale;

	/**
	 * @ORM\Column(name="is_active", type="boolean")
	 */
	private $isActive;

	/**
	 * @var \DateTime
     * @ORM\Column(name="last_login", type="datetime")
	 */
	private $lastLogin;

	/**
	 * @ORM\Column(name="is_admin", type="boolean", options={"default": false})
	 */
	private $isAdmin;

    /**
    * @ORM\ManyToMany(targetEntity="Sketch", mappedBy="authors")
    * @ORM\JoinColumn(name="sketch", referencedColumnName="id")
    */
    private $sketches;

    /**
    * @ORM\ManyToMany(targetEntity="Sketch", inversedBy="sketches")
    * @ORM\JoinColumn(name="sketch", referencedColumnName="id")
    */
    private $liked_sketches;

    /**
    * @ORM\ManyToOne(targetEntity="Sketch", inversedBy="users")
    * @ORM\JoinColumn(name="sketch", referencedColumnName="id")
    */
    private $editedSketch;

	/**
	 * @ORM\Column(name="edit_token", type="string", options={"default": null})
	 */
	private $editToken;


	public function __construct() {
		$this->isActive = true;
		$this->lastLogin = new \DateTime('now');
		$this->isAdmin = false;
		$this->username = "";
		$this->salt = md5(uniqid(null, true));
        $this->sketches = new ArrayCollection();
	}

	public function eraseCredentials() {

	}

	public function getPassword(): string {
		return $this->password;
	}

	public function getRoles() {
		return array('ROLE_USER');
	}

	public function getSalt() {
		return $this->salt;
	}

	public function getUsername(): string {
		return $this->username;
	}

	public function serialize(): string {
		return serialize(array(
			$this->id,
			$this->username,
			$this->password,
			$this->salt
		));
	}

	public function unserialize($serialized) {
		return list(
			$this->id,
			$this->username,
			$this->password,
			$this->salt
		) = unserialize($serialized);
	}


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Set password
     *
     * @param string $password
     *
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     *
     * @return User
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * Set isAdmin
     *
     * @param boolean $isAdmin
     *
     * @return User
     */
    public function setIsAdmin($isAdmin)
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    /**
     * Get isAdmin
     *
     * @return boolean
     */
    public function getIsAdmin()
    {
        return $this->isAdmin;
    }

	public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    public function setPlainPassword($password)
    {
        $this->plainPassword = $password;
    }

    /**
     * Set locale
     *
     * @param string $locale
     *
     * @return User
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;

        return $this;
    }

    /**
     * Get locale
     *
     * @return string
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * Add sketch
     *
     * @param Sketch $sketch
     *
     * @return User
     */
    public function addSketch(Sketch $sketch)
    {
        $this->sketches[] = $sketch;

        return $this;
    }

    /**
     * Remove sketch
     *
     * @param Sketch $sketch
     */
    public function removeSketch(Sketch $sketch)
    {
        $this->sketches->removeElement($sketch);
    }

    /**
     * Get sketches
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSketches()
    {
        return $this->sketches;
    }

    /**
     * Get sketchesLiked
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSketchesLiked()
    {
        return $this->liked_sketches;
    }

    /**
     * Like a sketch
     *
     * @param \AppBundle\Entity\Sketch $sketch
     *
     * @return User
     */
    public function like(\AppBundle\Entity\Sketch $sketch)
    {
        $this->liked_sketches->add($sketch);

        return $this;
    }

    /**
     * Dislike a sketch
     *
     * @param \AppBundle\Entity\Sketch $sketch
     */
    public function dislike(\AppBundle\Entity\Sketch $sketch)
    {
        $this->liked_sketches->removeElement($sketch);
    }

    /**
     * Toggle like on sketch
     *
     * @param \AppBundle\Entity\Sketch $sketch
     */
    public function toggleLike(\AppBundle\Entity\Sketch $sketch)
    {
		if($this->likes($sketch))
        	$this->dislike($sketch);
		else
			$this->like($sketch);
    }

    /**
     * Add likedSketch
     *
     * @param \AppBundle\Entity\Sketch $likedSketch
     *
     * @return User
     */
    public function addLikedSketch(\AppBundle\Entity\Sketch $likedSketch)
    {
        $this->liked_sketches[] = $likedSketch;

        return $this;
    }

    /**
     * Remove likedSketch
     *
     * @param \AppBundle\Entity\Sketch $likedSketch
     */
    public function removeLikedSketch(\AppBundle\Entity\Sketch $likedSketch)
    {
        $this->liked_sketches->removeElement($likedSketch);
    }

    /**
     * Get likedSketches
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getLikedSketches()
    {
        return $this->liked_sketches;
    }

    /*
    *  Return if User like a specific Sketch
    *
    *   @return boolean
    */
    public function likes(\AppBundle\Entity\Sketch $sketch) {

        return $this->liked_sketches->contains($sketch);
    }

    /*
    *  Return if User is author of the given sketch
    *
    *   @return boolean
    */
    public function isAuthorOf(\AppBundle\Entity\Sketch $sketch) {

        return $this->sketches->contains($sketch);
    }

    /**
     * Set lastLogin
     *
     * @param \DateTime $lastLogin
     *
     * @return User
     */
    public function setLastLogin($lastLogin)
    {
        $this->lastLogin = $lastLogin;

        return $this;
    }

    /**
     * Get lastLogin
     *
     * @return \DateTime
     */
    public function getLastLogin()
    {
        return $this->lastLogin;
    }

    /**
     * Check if user is logged in
     *
     * @return boolean
     */
    public function isLoggedIn()
    {
		$d = new \DateTime('now');
		$d->sub(new \DateInterval('PT5M'));
        return ($this->lastLogin > $d);
    }


    /**
     * Set editedSketch
     *
     * @param \AppBundle\Entity\Sketch $editedSketch
     *
     * @return User
     */
    public function setEditedSketch(\AppBundle\Entity\Sketch $editedSketch = null)
    {
        $this->editedSketch = $editedSketch;

        return $this;
    }

    /**
     * Get editedSketch
     *
     * @return \AppBundle\Entity\Sketch
     */
    public function getEditedSketch()
    {
        return $this->editedSketch;
    }

    /**
     * Set editToken
     *
     * @return string
     */
    public function setEditToken()
    {
        $this->editToken = md5(uniqid(true).$this->password);

        return $this->editToken;
    }

    /**
     * Get editToken
     *
     * @return string
     */
    public function getEditToken()
    {
        return $this->editToken;
    }
}
